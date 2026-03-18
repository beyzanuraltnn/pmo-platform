using PMO.Platform.Domain.Common.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Domain.Entities;

public sealed class Gate : BaseEntity
{
    public Guid ProjectId { get; set; }
    public int GateNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public GateStatus Status { get; set; }
    public DateTime OpenDate { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? ClosedDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public int RequiredEvidenceCount { get; set; }
    public string? CurrentStep { get; set; }
    public string? CurrentOwner { get; set; }
    public DateTime OpenedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public Project Project { get; set; } = null!;
    public ICollection<GateApproval> Approvals { get; set; } = new List<GateApproval>();
    public ICollection<EvidenceFile> EvidenceFiles { get; set; } = new List<EvidenceFile>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public sealed class GateApproval : BaseEntity
{
    public Guid GateId { get; set; }
    public Guid ApproverId { get; set; }
    public string ApproverName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public ApprovalStatus Status { get; set; }
    public string? Note { get; set; }
    public DateTime? DecisionAt { get; set; }

    public Gate Gate { get; set; } = null!;
    public User Approver { get; set; } = null!;
    public ICollection<EvidenceFile> EvidenceFiles { get; set; } = new List<EvidenceFile>();
}

public sealed class EvidenceFile : BaseEntity
{
    public Guid GateId { get; set; }
    public Guid? GateApprovalId { get; set; }
    public Guid UploadedById { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string UploadedByName { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
    public bool IsRequired { get; set; }
    public EvidenceCategory Category { get; set; }

    public Gate Gate { get; set; } = null!;
    public GateApproval? GateApproval { get; set; }
    public User UploadedBy { get; set; } = null!;
}

public sealed class Notification : BaseEntity
{
    public Guid RecipientUserId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? GateId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public DateTime SentAt { get; set; }

    public User RecipientUser { get; set; } = null!;
    public Project? Project { get; set; }
    public Gate? Gate { get; set; }
}

public sealed class RaidItem : BaseEntity
{
    public Guid ProjectId { get; set; }
    public RaidItemType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RaidStatus Status { get; set; }
    public RaidPriority? Priority { get; set; }
    public RaidImpact? Impact { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string ActionPlan { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime? ResolvedDate { get; set; }
    public string Note { get; set; } = string.Empty;

    public Project Project { get; set; } = null!;
}
