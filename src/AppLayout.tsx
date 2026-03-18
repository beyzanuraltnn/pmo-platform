using System.Globalization;
using PMO.Platform.Application.Gates;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

internal static class GateMappingHelper
{
    private static readonly CultureInfo TurkishCulture = new("tr-TR");

    public static GateListItemDto MapListItem(Gate gate)
    {
        var uploadedEvidenceCount = gate.EvidenceFiles.Count;
        var pendingApprovalCount = gate.Approvals.Count(x => x.Status == ApprovalStatus.Pending);
        var owner = gate.CurrentOwner
            ?? gate.Approvals.FirstOrDefault(x => x.Status == ApprovalStatus.Pending)?.ApproverName
            ?? "-";

        return new GateListItemDto
        {
            Id = gate.Id,
            GateNo = gate.GateNo,
            Name = gate.Name,
            Status = gate.Status.ToString(),
            DueDateText = FormatDate(gate.DueDate),
            UploadedEvidenceCount = uploadedEvidenceCount,
            RequiredEvidenceCount = gate.RequiredEvidenceCount,
            PendingApprovalCount = pendingApprovalCount,
            Owner = owner,
            Note = BuildNote(gate, uploadedEvidenceCount, pendingApprovalCount)
        };
    }

    public static GateDetailDto MapDetail(Gate gate, Guid userId, IReadOnlyList<string> roles)
    {
        var uploadedEvidenceCount = gate.EvidenceFiles.Count;
        var currentApproval = gate.Approvals.FirstOrDefault(x => x.ApproverId == userId && x.Status == ApprovalStatus.Pending);
        var canSubmit = (roles.Contains(SystemRoles.ProjectManager) || roles.Contains(SystemRoles.PmoAdmin))
            && gate.Status is GateStatus.Draft or GateStatus.MissingEvidence or GateStatus.ReadyForSubmit or GateStatus.Rejected
            && uploadedEvidenceCount >= gate.RequiredEvidenceCount;
        var canApprove = gate.Status == GateStatus.WaitingApproval && currentApproval is not null;
        var canReject = gate.Status == GateStatus.WaitingApproval && currentApproval is not null;

        return new GateDetailDto
        {
            Id = gate.Id,
            ProjectId = gate.ProjectId,
            GateNo = gate.GateNo,
            Name = gate.Name,
            Status = gate.Status.ToString(),
            Description = gate.Description,
            OpenDateText = FormatDate(gate.OpenDate),
            DueDateText = FormatDate(gate.DueDate),
            ClosedDateText = FormatDate(gate.ClosedDate),
            RequiredEvidenceCount = gate.RequiredEvidenceCount,
            UploadedEvidenceCount = uploadedEvidenceCount,
            CanSubmit = canSubmit,
            CanApprove = canApprove,
            CanReject = canReject,
            Evidences = gate.EvidenceFiles
                .OrderByDescending(x => x.UploadedAt)
                .Select(MapEvidence)
                .ToList(),
            Approvals = gate.Approvals
                .OrderBy(x => x.Role)
                .Select(MapApproval)
                .ToList()
        };
    }

    public static EvidenceItemDto MapEvidence(EvidenceFile evidence)
    {
        return new EvidenceItemDto
        {
            Id = evidence.Id,
            FileName = evidence.OriginalFileName,
            UploadedBy = evidence.UploadedByName,
            UploadedAtText = FormatDateTime(evidence.UploadedAt),
            Category = evidence.Category.ToString(),
            IsRequired = evidence.IsRequired
        };
    }

    public static ApprovalItemDto MapApproval(GateApproval approval)
    {
        return new ApprovalItemDto
        {
            Id = approval.Id,
            ApproverName = approval.ApproverName,
            Role = approval.Role,
            Status = approval.Status.ToString(),
            DecisionDateText = FormatDateTime(approval.DecisionAt),
            Note = approval.Note
        };
    }

    public static string FormatDate(DateTime? value)
    {
        return value?.ToString("dd MMM yyyy", TurkishCulture) ?? "-";
    }

    public static string? FormatDateTime(DateTime? value)
    {
        return value?.ToString("dd MMM yyyy HH:mm", TurkishCulture);
    }

    private static string BuildNote(Gate gate, int uploadedEvidenceCount, int pendingApprovalCount)
    {
        return gate.Status switch
        {
            GateStatus.MissingEvidence => $"{uploadedEvidenceCount}/{gate.RequiredEvidenceCount} kanıt yüklendi",
            GateStatus.ReadyForSubmit => "Onaya gönderime hazır",
            GateStatus.WaitingApproval => $"{pendingApprovalCount} onay bekliyor",
            GateStatus.Approved => "Gate tamamlandı",
            GateStatus.Rejected => "Ret sonrası düzeltme bekleniyor",
            _ => "Taslak"
        };
    }
}
