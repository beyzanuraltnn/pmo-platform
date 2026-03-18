using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Gates;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

public sealed class GateService(IApplicationDbContext dbContext) : IGateService
{
    public async Task<IReadOnlyList<GateListItemDto>> GetProjectGatesAsync(Guid projectId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var gates = await LoadProjectGates(projectId, cancellationToken);
        return gates.Select(GateMappingHelper.MapListItem).ToList();
    }

    public async Task<GateDetailDto?> GetGateDetailAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var gate = await LoadGate(gateId, cancellationToken);
        return gate is null ? null : GateMappingHelper.MapDetail(gate, userId, roles);
    }

    public async Task<GateDetailDto> SubmitGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var gate = await LoadGateForUpdate(gateId, cancellationToken);

        EnsureProjectManagerCanSubmit(gate, userId, roles);
        RefreshGateStatusFromEvidence(gate);

        if (gate.EvidenceFiles.Count(x => !x.IsDeleted) < gate.RequiredEvidenceCount)
        {
            throw new InvalidOperationException("Zorunlu kanıtlar tamamlanmadan gate onaya gönderilemez.");
        }

        var existingApprovals = gate.Approvals.ToList();
        if (existingApprovals.Count > 0)
        {
            dbContext.GateApprovals.RemoveRange(existingApprovals);
            gate.Approvals.Clear();
        }

        var approvers = await ResolveApproversAsync(gate.GateNo, cancellationToken);

        foreach (var approver in approvers)
        {
            gate.Approvals.Add(new GateApproval
            {
                Id = Guid.NewGuid(),
                GateId = gate.Id,
                ApproverId = approver.UserId,
                ApproverName = approver.ApproverName,
                Role = approver.Role,
                Status = ApprovalStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId.ToString()
            });

            dbContext.Notifications.Add(new Notification
            {
                Id = Guid.NewGuid(),
                RecipientUserId = approver.UserId,
                ProjectId = gate.ProjectId,
                GateId = gate.Id,
                Title = $"Gate {gate.GateNo} Onayı Bekliyor",
                Content = $"{gate.Project.Name} projesi için {gate.Name} onayı bekleniyor.",
                Type = NotificationType.GateApproval,
                IsRead = false,
                SentAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId.ToString()
            });
        }

        gate.Status = GateStatus.WaitingApproval;
        gate.CurrentStep = "Onay Bekliyor";
        gate.CurrentOwner = string.Join(", ", approvers.Select(x => x.Role).Distinct());
        gate.ClosedDate = null;
        gate.ClosedAt = null;

        await dbContext.SaveChangesAsync(cancellationToken);
        return GateMappingHelper.MapDetail(gate, userId, roles);
    }

    public async Task<GateDetailDto> ApproveGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, string? note, CancellationToken cancellationToken = default)
    {
        var gate = await LoadGateForUpdate(gateId, cancellationToken);
        var approval = EnsureApproverAccess(gate, userId, roles);

        if (gate.Status != GateStatus.WaitingApproval)
        {
            throw new InvalidOperationException("Sadece onay bekleyen gate onaylanabilir.");
        }

        approval.Status = ApprovalStatus.Approved;
        approval.Note = note;
        approval.DecisionAt = DateTime.UtcNow;

        var allApproved = gate.Approvals.All(x => x.Status == ApprovalStatus.Approved);

        if (allApproved)
        {
            gate.Status = GateStatus.Approved;
            gate.ClosedDate = DateTime.UtcNow;
            gate.ClosedAt = DateTime.UtcNow;
            gate.CurrentStep = "Tamamlandı";
            gate.CurrentOwner = null;

            await CreateNotificationForUser(gate.Project.ProjectManagerId, gate, "Gate Onaylandı", $"{gate.Name} tüm onayları tamamladı.", NotificationType.GateApproval, userId);

            var adminIds = await GetUsersByRoleAsync(SystemRoles.PmoAdmin, cancellationToken);
            foreach (var adminId in adminIds.Where(x => x != gate.Project.ProjectManagerId))
            {
                await CreateNotificationForUser(adminId, gate, "Gate Final Onayı Tamamlandı", $"{gate.Project.Name} projesinde {gate.Name} onayı tamamlandı.", NotificationType.GateApproval, userId);
            }
        }
        else
        {
            gate.CurrentOwner = string.Join(", ", gate.Approvals.Where(x => x.Status == ApprovalStatus.Pending).Select(x => x.Role).Distinct());
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return GateMappingHelper.MapDetail(gate, userId, roles);
    }

    public async Task<GateDetailDto> RejectGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, string note, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(note))
        {
            throw new InvalidOperationException("Ret notu zorunludur.");
        }

        var gate = await LoadGateForUpdate(gateId, cancellationToken);
        var approval = EnsureApproverAccess(gate, userId, roles);

        if (gate.Status != GateStatus.WaitingApproval)
        {
            throw new InvalidOperationException("Sadece onay bekleyen gate reddedilebilir.");
        }

        approval.Status = ApprovalStatus.Rejected;
        approval.Note = note;
        approval.DecisionAt = DateTime.UtcNow;

        gate.Status = GateStatus.Rejected;
        gate.CurrentStep = "Reddedildi";
        gate.CurrentOwner = $"{gate.Project.ProjectManager.FirstName} {gate.Project.ProjectManager.LastName}";

        await CreateNotificationForUser(
            gate.Project.ProjectManagerId,
            gate,
            $"Gate {gate.GateNo} Reddedildi",
            $"{gate.Name} reddedildi. Not: {note}",
            NotificationType.GateRejected,
            userId);

        await dbContext.SaveChangesAsync(cancellationToken);
        return GateMappingHelper.MapDetail(gate, userId, roles);
    }

    private async Task<List<Gate>> LoadProjectGates(Guid projectId, CancellationToken cancellationToken)
    {
        return await dbContext.Gates
            .AsNoTracking()
            .Where(x => x.ProjectId == projectId)
            .Include(x => x.EvidenceFiles)
            .Include(x => x.Approvals)
            .OrderBy(x => x.GateNo)
            .ToListAsync(cancellationToken);
    }

    private async Task<Gate?> LoadGate(Guid gateId, CancellationToken cancellationToken)
    {
        return await dbContext.Gates
            .AsNoTracking()
            .Include(x => x.Project)
                .ThenInclude(x => x.ProjectManager)
            .Include(x => x.EvidenceFiles)
            .Include(x => x.Approvals)
            .SingleOrDefaultAsync(x => x.Id == gateId, cancellationToken);
    }

    private async Task<Gate> LoadGateForUpdate(Guid gateId, CancellationToken cancellationToken)
    {
        var gate = await dbContext.Gates
            .Include(x => x.Project)
                .ThenInclude(x => x.ProjectManager)
            .Include(x => x.EvidenceFiles)
            .Include(x => x.Approvals)
            .SingleOrDefaultAsync(x => x.Id == gateId, cancellationToken);

        return gate ?? throw new InvalidOperationException("Gate bulunamadı.");
    }

    private static void EnsureProjectManagerCanSubmit(Gate gate, Guid userId, IReadOnlyList<string> roles)
    {
        var canSubmit = roles.Contains(SystemRoles.PmoAdmin) ||
                        (roles.Contains(SystemRoles.ProjectManager) && gate.Project.ProjectManagerId == userId);

        if (!canSubmit)
        {
            throw new UnauthorizedAccessException("Bu gate'i onaya gönderme yetkiniz yok.");
        }
    }

    private GateApproval EnsureApproverAccess(Gate gate, Guid userId, IReadOnlyList<string> roles)
    {
        var approval = gate.Approvals.FirstOrDefault(x => x.ApproverId == userId && x.Status == ApprovalStatus.Pending);

        if (approval is null)
        {
            throw new UnauthorizedAccessException("Bu gate üzerinde onay/reddetme yetkiniz yok.");
        }

        if (roles.Contains(SystemRoles.Viewer))
        {
            throw new UnauthorizedAccessException("Gözlemci rolü işlem yapamaz.");
        }

        return approval;
    }

    internal static void RefreshGateStatusFromEvidence(Gate gate)
    {
        if (gate.Status is GateStatus.WaitingApproval or GateStatus.Approved)
        {
            return;
        }

        var uploadedEvidenceCount = gate.EvidenceFiles.Count(x => !x.IsDeleted);

        gate.Status = uploadedEvidenceCount switch
        {
            0 => GateStatus.Draft,
            _ when uploadedEvidenceCount < gate.RequiredEvidenceCount => GateStatus.MissingEvidence,
            _ => GateStatus.ReadyForSubmit
        };

        gate.CurrentStep = gate.Status switch
        {
            GateStatus.Draft => "Taslak",
            GateStatus.MissingEvidence => "Eksik Kanıt",
            GateStatus.ReadyForSubmit => "Gönderime Hazır",
            _ => gate.CurrentStep
        };
    }

    private async Task<List<(Guid UserId, string ApproverName, string Role)>> ResolveApproversAsync(int gateNo, CancellationToken cancellationToken)
    {
        var requiredRoles = GetRequiredRolesForGate(gateNo);

        var approvers = await dbContext.UserRoles
            .AsNoTracking()
            .Where(x => requiredRoles.Contains(x.Role.Name))
            .Select(x => new
            {
                x.UserId,
                Role = x.Role.Name,
                Name = x.User.FirstName + " " + x.User.LastName
            })
            .ToListAsync(cancellationToken);

        var result = new List<(Guid UserId, string ApproverName, string Role)>();

        foreach (var role in requiredRoles)
        {
            var approver = approvers.FirstOrDefault(x => x.Role == role)
                ?? throw new InvalidOperationException($"Gate {gateNo} için {role} rolünde onaylayıcı bulunamadı.");

            result.Add((approver.UserId, approver.Name, approver.Role));
        }

        return result;
    }

    private static IReadOnlyList<string> GetRequiredRolesForGate(int gateNo) => gateNo switch
    {
        1 => [SystemRoles.PmoAdmin, SystemRoles.ProductManager],
        2 => [SystemRoles.PmoAdmin, SystemRoles.TechLead, SystemRoles.ProductManager],
        3 => [SystemRoles.TechLead, SystemRoles.PmoAdmin],
        4 => [SystemRoles.Qa, SystemRoles.ProductManager, SystemRoles.PmoAdmin],
        5 => [SystemRoles.PmoAdmin, SystemRoles.TechLead, SystemRoles.Cto],
        6 => [SystemRoles.PmoAdmin],
        _ => [SystemRoles.PmoAdmin]
    };

    private async Task CreateNotificationForUser(Guid userId, Gate gate, string title, string content, NotificationType type, Guid actorUserId)
    {
        await dbContext.Notifications.AddAsync(new Notification
        {
            Id = Guid.NewGuid(),
            RecipientUserId = userId,
            ProjectId = gate.ProjectId,
            GateId = gate.Id,
            Title = title,
            Content = content,
            Type = type,
            IsRead = false,
            SentAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = actorUserId.ToString()
        });
    }

    private async Task<List<Guid>> GetUsersByRoleAsync(string roleName, CancellationToken cancellationToken)
    {
        return await dbContext.UserRoles
            .AsNoTracking()
            .Where(x => x.Role.Name == roleName)
            .Select(x => x.UserId)
            .ToListAsync(cancellationToken);
    }
}
