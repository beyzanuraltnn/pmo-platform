namespace PMO.Platform.Application.Raid;

public sealed class GetRaidItemsQueryDto
{
    public string? Type { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Search { get; set; }
}

public sealed class RaidListItemDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? Impact { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string DueDateText { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string BadgeTone { get; set; } = string.Empty;
}

public sealed class RaidDetailDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? Impact { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string ActionPlan { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string DueDateText { get; set; } = string.Empty;
    public DateTime? ResolvedDate { get; set; }
    public string? ResolvedDateText { get; set; }
    public string Note { get; set; } = string.Empty;
    public bool CanEdit { get; set; }
    public bool CanClose { get; set; }
}

public sealed class RaidSummaryDto
{
    public int TotalCount { get; set; }
    public int OpenCount { get; set; }
    public int CriticalRiskCount { get; set; }
    public int OverdueCount { get; set; }
    public int RiskCount { get; set; }
    public int IssueCount { get; set; }
    public int AssumptionCount { get; set; }
    public int DependencyCount { get; set; }
}

public sealed class CreateRaidItemRequestDto
{
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Priority { get; set; }
    public string? Impact { get; set; }
    public string Owner { get; set; } = string.Empty;
    public string ActionPlan { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string Note { get; set; } = string.Empty;
}

public sealed class UpdateRaidItemRequestDto : CreateRaidItemRequestDto
{
}

public sealed class CloseRaidItemRequestDto
{
    public string? Note { get; set; }
}
