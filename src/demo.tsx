using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Gates;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

public sealed class EvidenceService(
    IApplicationDbContext dbContext,
    ILocalFileStorage localFileStorage) : IEvidenceService
{
    public async Task<EvidenceItemDto> UploadEvidenceAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, UploadEvidenceRequestDto request, CancellationToken cancellationToken = default)
    {
        var gate = await dbContext.Gates
            .Include(x => x.Project)
                .ThenInclude(x => x.ProjectManager)
            .Include(x => x.EvidenceFiles)
            .SingleOrDefaultAsync(x => x.Id == gateId, cancellationToken)
            ?? throw new InvalidOperationException("Gate bulunamadı.");

        var canUpload = roles.Contains(SystemRoles.PmoAdmin) ||
                        (roles.Contains(SystemRoles.ProjectManager) && gate.Project.ProjectManagerId == userId);

        if (!canUpload)
        {
            throw new UnauthorizedAccessException("Bu gate için kanıt yükleme yetkiniz yok.");
        }

        if (gate.Status is GateStatus.WaitingApproval or GateStatus.Approved)
        {
            throw new InvalidOperationException("Onaya gönderilmiş veya onaylanmış gate'e yeni kanıt yüklenemez.");
        }

        if (!Enum.TryParse<EvidenceCategory>(request.Category, true, out var category))
        {
            throw new InvalidOperationException("Geçersiz evidence kategorisi.");
        }

        var uploader = await dbContext.Users.AsNoTracking().SingleAsync(x => x.Id == userId, cancellationToken);
        var storedFile = await localFileStorage.SaveGateEvidenceAsync(gateId, request.File, cancellationToken);

        var evidence = new EvidenceFile
        {
            Id = Guid.NewGuid(),
            GateId = gateId,
            UploadedById = userId,
            UploadedByName = $"{uploader.FirstName} {uploader.LastName}".Trim(),
            FileName = storedFile.StoredFileName,
            OriginalFileName = request.File.FileName,
            FilePath = storedFile.RelativePath,
            ContentType = string.IsNullOrWhiteSpace(storedFile.ContentType) ? "application/octet-stream" : storedFile.ContentType,
            FileSize = storedFile.FileSize,
            UploadedAt = DateTime.UtcNow,
            IsRequired = request.IsRequired,
            Category = category,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId.ToString()
        };

        await dbContext.EvidenceFiles.AddAsync(evidence, cancellationToken);
        gate.EvidenceFiles.Add(evidence);
        GateService.RefreshGateStatusFromEvidence(gate);
        gate.CurrentOwner = $"{gate.Project.ProjectManager.FirstName} {gate.Project.ProjectManager.LastName}";

        await dbContext.SaveChangesAsync(cancellationToken);
        return GateMappingHelper.MapEvidence(evidence);
    }

    public async Task<bool> DeleteEvidenceAsync(Guid gateId, Guid evidenceId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var gate = await dbContext.Gates
            .Include(x => x.Project)
                .ThenInclude(x => x.ProjectManager)
            .Include(x => x.EvidenceFiles)
            .SingleOrDefaultAsync(x => x.Id == gateId, cancellationToken);

        if (gate is null)
        {
            return false;
        }

        var canDelete = roles.Contains(SystemRoles.PmoAdmin) ||
                        (roles.Contains(SystemRoles.ProjectManager) && gate.Project.ProjectManagerId == userId);

        if (!canDelete)
        {
            throw new UnauthorizedAccessException("Bu gate için kanıt silme yetkiniz yok.");
        }

        if (gate.Status is not GateStatus.Draft and not GateStatus.Rejected and not GateStatus.MissingEvidence and not GateStatus.ReadyForSubmit)
        {
            throw new InvalidOperationException("Kanıt yalnızca draft veya rejected aşamasında silinebilir.");
        }

        var evidence = gate.EvidenceFiles.FirstOrDefault(x => x.Id == evidenceId);
        if (evidence is null)
        {
            return false;
        }

        dbContext.EvidenceFiles.Remove(evidence);
        await localFileStorage.DeleteAsync(evidence.FilePath, cancellationToken);
        gate.EvidenceFiles.Remove(evidence);
        GateService.RefreshGateStatusFromEvidence(gate);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
