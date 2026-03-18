namespace PMO.Platform.Application.Projects;

public sealed class GetProjectsQueryDto
{
    public string? Status { get; set; }
    public string? Search { get; set; }
}

public sealed class CreateProjectRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BusinessOwner { get; set; } = string.Empty;
    public Guid ProjectManagerId { get; set; }
    public string Sponsor { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string RagStatus { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public DateTime? PlannedStartDate { get; set; }
    public DateTime? PlannedEndDate { get; set; }
    public DateTime? ExpectedGoLiveDate { get; set; }
    public DateTime? ActualGoLiveDate { get; set; }
    public decimal? Budget { get; set; }
    public string Department { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public sealed class UpdateProjectRequestDto : CreateProjectRequestDto
{
}

public sealed class ProjectListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BusinessOwner { get; set; } = string.Empty;
    public Guid ProjectManagerId { get; set; }
    public string ProjectManager { get; set; } = string.Empty;
    public string Sponsor { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string? Stage { get; set; }
    public string? RagStatus { get; set; }
    public string? PlannedStartDateText { get; set; }
    public string? PlannedEndDateText { get; set; }
    public string? ExpectedGoLiveDateText { get; set; }
    public string? ActualGoLiveDateText { get; set; }
    public string? BudgetText { get; set; }
    public string? GoLiveDateText { get; set; }
    public string? RiskLevel { get; set; }
    public string? StageGateStatus { get; set; }
    public string? PlannedStartText { get; set; }
    public string? ExpectedGoLiveText { get; set; }
    public string? Note { get; set; }
    public string? ScheduleVarianceText { get; set; }
    public string? UatRateText { get; set; }
}

public sealed class ProjectDetailDto : ProjectListItemDto
{
    public DateTime? PlannedStartDate { get; set; }
    public DateTime? PlannedEndDate { get; set; }
    public DateTime? ExpectedGoLiveDate { get; set; }
    public DateTime? ActualGoLiveDate { get; set; }
    public bool CanEdit { get; set; }
    public bool CharterExists { get; set; }
}

public sealed class ProjectSummaryDto
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public bool CharterExists { get; set; }
    public string LatestGateStatus { get; set; } = string.Empty;
    public int NotificationCount { get; set; }
}

public sealed class ProjectCharterDetailDto
{
    public Guid? Id { get; set; }
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
    public int Version { get; set; }
    public string? LastReviewedAtText { get; set; }
    public bool Exists { get; set; }
    public bool CanEdit { get; set; }
}

public sealed class CreateOrUpdateProjectCharterRequestDto
{
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
}

public sealed class DashboardSummaryCardDto
{
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public string Note { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
}

public sealed class DashboardProjectDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string ProjectManager { get; set; } = string.Empty;
    public string Stage { get; set; } = string.Empty;
    public string RagStatus { get; set; } = string.Empty;
    public string GoLiveDateText { get; set; } = string.Empty;
    public string RiskLevel { get; set; } = string.Empty;
}

public sealed class WeeklyGoLiveDto
{
    public string ProjectName { get; set; } = string.Empty;
    public string DateText { get; set; } = string.Empty;
    public string StatusText { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
}

public sealed class DelayedMilestoneDto
{
    public string ProjectName { get; set; } = string.Empty;
    public string MilestoneName { get; set; } = string.Empty;
    public string PlannedDateText { get; set; } = string.Empty;
    public string NewTargetDateText { get; set; } = string.Empty;
}

public sealed class CriticalRiskDto
{
    public string ProjectName { get; set; } = string.Empty;
    public string RiskText { get; set; } = string.Empty;
    public string ImpactLevel { get; set; } = string.Empty;
    public string ActionText { get; set; } = string.Empty;
}

public sealed class DashboardActionItemDto
{
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
    public string Tone { get; set; } = string.Empty;
}

public sealed class DashboardSummaryDto
{
    public int ActiveProjectCount { get; set; }
    public int PlannedProjectCount { get; set; }
    public int CompletedProjectCount { get; set; }
    public int CriticalRiskCount { get; set; }
    public int OverdueMilestoneCount { get; set; }
    public int PendingApprovalCount { get; set; }
    public int GoLiveThisWeek { get; set; }
    public IReadOnlyList<DashboardSummaryCardDto> SummaryCards { get; set; } = Array.Empty<DashboardSummaryCardDto>();
    public IReadOnlyList<DashboardProjectDto> DashboardProjects { get; set; } = Array.Empty<DashboardProjectDto>();
    public IReadOnlyList<DashboardProjectDto> ActiveProjects { get; set; } = Array.Empty<DashboardProjectDto>();
    public IReadOnlyList<WeeklyGoLiveDto> WeeklyGoLives { get; set; } = Array.Empty<WeeklyGoLiveDto>();
    public IReadOnlyList<DelayedMilestoneDto> DelayedMilestones { get; set; } = Array.Empty<DelayedMilestoneDto>();
    public IReadOnlyList<CriticalRiskDto> CriticalRisks { get; set; } = Array.Empty<CriticalRiskDto>();
    public IReadOnlyList<DashboardActionItemDto> ActionItems { get; set; } = Array.Empty<DashboardActionItemDto>();
}
