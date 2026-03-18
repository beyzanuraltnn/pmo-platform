using System.ComponentModel.DataAnnotations.Schema;
using PMO.Platform.Domain.Common.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Domain.Entities;

public sealed class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public ProjectType Type { get; set; }
    public ProjectStatus Status { get; set; }
    public string Description { get; set; } = string.Empty;
    public string BusinessOwner { get; set; } = string.Empty;
    public RagStatus RagStatus { get; set; }
    public string Sponsor { get; set; } = string.Empty;
    public ProjectPriority Priority { get; set; }
    public ProjectStage Stage { get; set; }
    public DateTime? PlannedStartDate { get; set; }
    public DateTime? PlannedEndDate { get; set; }
    public DateTime? ExpectedGoLiveDate { get; set; }
    public DateTime? ActualGoLiveDate { get; set; }
    public decimal? Budget { get; set; }
    public string Department { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public Guid ProjectManagerId { get; set; }

    [NotMapped]
    public DateTime? GoLiveDate
    {
        get => ExpectedGoLiveDate;
        set => ExpectedGoLiveDate = value;
    }

    public User ProjectManager { get; set; } = null!;
    public ProjectCharter? Charter { get; set; }
    public ICollection<Gate> Gates { get; set; } = new List<Gate>();
    public ICollection<RaidItem> RaidItems { get; set; } = new List<RaidItem>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public sealed class ProjectCharter : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string Objectives { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string OutOfScope { get; set; } = string.Empty;
    public string SuccessCriteria { get; set; } = string.Empty;
    public string RisksAndAssumptions { get; set; } = string.Empty;
    public string Dependencies { get; set; } = string.Empty;
    public string Stakeholders { get; set; } = string.Empty;
    public string TimelineSummary { get; set; } = string.Empty;
    public string BudgetSummary { get; set; } = string.Empty;
    public string ApprovalNotes { get; set; } = string.Empty;
    public int Version { get; set; } = 1;
    public DateTime? LastReviewedAt { get; set; }

    [NotMapped]
    public string Risks
    {
        get => RisksAndAssumptions;
        set => RisksAndAssumptions = value;
    }

    [NotMapped]
    public CharterApprovalStatus ApprovalStatus { get; set; } = CharterApprovalStatus.Draft;

    public Project Project { get; set; } = null!;
}
