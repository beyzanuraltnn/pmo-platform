using Microsoft.AspNetCore.Http;

namespace PMO.Platform.Application.Gates;

public sealed class GateListItemDto
{
    public Guid Id { get; set; }
    public int GateNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string DueDateText { get; set; } = string.Empty;
    public int UploadedEvidenceCount { get; set; }
    public int RequiredEvidenceCount { get; set; }
    public int PendingApprovalCount { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}

public sealed class EvidenceItemDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string UploadedBy { get; set; } = string.Empty;
    public string UploadedAtText { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
}

public sealed class ApprovalItemDto
{
    public Guid Id { get; set; }
    public string ApproverName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? DecisionDateText { get; set; }
    public string? Note { get; set; }
}

public sealed class GateDetailDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public int GateNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OpenDateText { get; set; } = string.Empty;
    public string DueDateText { get; set; } = string.Empty;
    public string? ClosedDateText { get; set; }
    public int RequiredEvidenceCount { get; set; }
    public int UploadedEvidenceCount { get; set; }
    public bool CanSubmit { get; set; }
    public bool CanApprove { get; set; }
    public bool CanReject { get; set; }
    public IReadOnlyList<EvidenceItemDto> Evidences { get; set; } = Array.Empty<EvidenceItemDto>();
    public IReadOnlyList<ApprovalItemDto> Approvals { get; set; } = Array.Empty<ApprovalItemDto>();
}

public sealed class UploadEvidenceRequestDto
{
    public IFormFile File { get; set; } = null!;
    public string Category { get; set; } = string.Empty;
    public bool IsRequired { get; set; }
}

public sealed class ApproveGateRequestDto
{
    public string? Note { get; set; }
}

public sealed class RejectGateRequestDto
{
    public string Note { get; set; } = string.Empty;
}
