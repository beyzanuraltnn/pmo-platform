using System.Globalization;
using PMO.Platform.Application.Projects;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

internal static class ProjectMappingHelper
{
    private static readonly CultureInfo TurkishCulture = new("tr-TR");

    public static ProjectListItemDto MapProject(Project project)
    {
        return new ProjectListItemDto
        {
            Id = project.Id,
            Name = project.Name,
            Code = project.Code,
            Type = TranslateProjectType(project.Type),
            Status = project.Status.ToString(),
            Description = project.Description,
            BusinessOwner = project.BusinessOwner,
            ProjectManagerId = project.ProjectManagerId,
            ProjectManager = $"{project.ProjectManager.FirstName} {project.ProjectManager.LastName}".Trim(),
            Sponsor = project.Sponsor,
            Priority = TranslatePriority(project.Priority),
            RagStatus = project.RagStatus.ToString(),
            Stage = TranslateStage(project.Stage),
            PlannedStartDateText = FormatDate(project.PlannedStartDate),
            PlannedEndDateText = FormatDate(project.PlannedEndDate),
            ExpectedGoLiveDateText = FormatDate(project.ExpectedGoLiveDate),
            ActualGoLiveDateText = FormatDate(project.ActualGoLiveDate),
            BudgetText = FormatBudget(project.Budget),
            Department = project.Department,
            Notes = project.Notes,
            GoLiveDateText = FormatGoLiveDate(project),
            RiskLevel = TranslateRiskLevel(project.RagStatus),
            StageGateStatus = BuildStageGateStatus(project.Gates),
            PlannedStartText = project.PlannedStartDate.HasValue ? FormatQuarter(project.PlannedStartDate.Value) : "-",
            ExpectedGoLiveText = project.ExpectedGoLiveDate.HasValue ? FormatQuarter(project.ExpectedGoLiveDate.Value) : "-",
            Note = project.Status == ProjectStatus.Planned ? "Planlama aşamasında" : project.Notes,
            ScheduleVarianceText = project.RagStatus == RagStatus.Red ? "+7" : project.RagStatus == RagStatus.Yellow ? "+2" : "+0",
            UatRateText = project.RagStatus == RagStatus.Red ? "82%" : project.RagStatus == RagStatus.Yellow ? "91%" : "96%"
        };
    }

    public static ProjectDetailDto MapProjectDetail(Project project, bool canEdit)
    {
        var dto = MapProject(project);
        return new ProjectDetailDto
        {
            Id = dto.Id,
            Name = dto.Name,
            Code = dto.Code,
            Type = dto.Type,
            Status = dto.Status,
            Description = dto.Description,
            BusinessOwner = dto.BusinessOwner,
            ProjectManager = dto.ProjectManager,
            Sponsor = dto.Sponsor,
            Priority = dto.Priority,
            RagStatus = dto.RagStatus,
            Stage = dto.Stage,
            PlannedStartDateText = dto.PlannedStartDateText,
            PlannedEndDateText = dto.PlannedEndDateText,
            ExpectedGoLiveDateText = dto.ExpectedGoLiveDateText,
            ActualGoLiveDateText = dto.ActualGoLiveDateText,
            BudgetText = dto.BudgetText,
            Department = dto.Department,
            Notes = dto.Notes,
            GoLiveDateText = dto.GoLiveDateText,
            RiskLevel = dto.RiskLevel,
            StageGateStatus = dto.StageGateStatus,
            PlannedStartText = dto.PlannedStartText,
            ExpectedGoLiveText = dto.ExpectedGoLiveText,
            Note = dto.Note,
            ScheduleVarianceText = dto.ScheduleVarianceText,
            UatRateText = dto.UatRateText,
            PlannedStartDate = project.PlannedStartDate,
            PlannedEndDate = project.PlannedEndDate,
            ExpectedGoLiveDate = project.ExpectedGoLiveDate,
            ActualGoLiveDate = project.ActualGoLiveDate,
            CanEdit = canEdit,
            CharterExists = project.Charter is not null
        };
    }

    public static ProjectCharterDetailDto MapCharter(ProjectCharter? charter, Guid projectId, bool canEdit)
    {
        if (charter is null)
        {
            return new ProjectCharterDetailDto
            {
                ProjectId = projectId,
                Exists = false,
                CanEdit = canEdit
            };
        }

        return new ProjectCharterDetailDto
        {
            Id = charter.Id,
            ProjectId = charter.ProjectId,
            Purpose = charter.Purpose,
            Objectives = charter.Objectives,
            Scope = charter.Scope,
            OutOfScope = charter.OutOfScope,
            SuccessCriteria = charter.SuccessCriteria,
            RisksAndAssumptions = charter.RisksAndAssumptions,
            Dependencies = charter.Dependencies,
            Stakeholders = charter.Stakeholders,
            TimelineSummary = charter.TimelineSummary,
            BudgetSummary = charter.BudgetSummary,
            ApprovalNotes = charter.ApprovalNotes,
            Version = charter.Version,
            LastReviewedAtText = FormatDateTime(charter.LastReviewedAt),
            Exists = true,
            CanEdit = canEdit
        };
    }

    public static string FormatGoLiveDate(Project project)
    {
        if (!project.ExpectedGoLiveDate.HasValue)
        {
            return "-";
        }

        if (project.ExpectedGoLiveDate.Value.Date < DateTime.UtcNow.Date && project.Status != ProjectStatus.Completed)
        {
            return "Gecikti";
        }

        return FormatQuarter(project.ExpectedGoLiveDate.Value);
    }

    public static string TranslateProjectType(ProjectType type) => type switch
    {
        ProjectType.Regulation => "Regülasyon",
        ProjectType.Integration => "Entegrasyon",
        ProjectType.Product => "Ürün",
        ProjectType.Infrastructure => "Altyapı",
        _ => type.ToString()
    };

    public static string TranslateStage(ProjectStage stage) => stage switch
    {
        ProjectStage.Initiation => "Başlatma",
        ProjectStage.Analysis => "Analiz",
        ProjectStage.Development => "Development",
        ProjectStage.Test => "Test",
        ProjectStage.GoLive => "Go-Live",
        ProjectStage.Closure => "Kapanış",
        _ => stage.ToString()
    };

    public static string TranslateRiskLevel(RagStatus ragStatus) => ragStatus switch
    {
        RagStatus.Green => "Düşük",
        RagStatus.Yellow => "Orta",
        RagStatus.Red => "Yüksek",
        _ => "Orta"
    };

    public static string TranslatePriority(ProjectPriority priority) => priority switch
    {
        ProjectPriority.Low => "Düşük",
        ProjectPriority.Medium => "Orta",
        ProjectPriority.High => "Yüksek",
        ProjectPriority.Critical => "Kritik",
        _ => priority.ToString()
    };

    public static string FormatDate(DateTime? value) => value?.ToString("dd MMM yyyy", TurkishCulture) ?? "-";

    public static string? FormatDateTime(DateTime? value) => value?.ToString("dd MMM yyyy HH:mm", TurkishCulture);

    public static string FormatBudget(decimal? value)
    {
        return value.HasValue ? string.Format(TurkishCulture, "{0:C0}", value.Value) : "-";
    }

    public static string FormatQuarter(DateTime date)
    {
        var quarter = ((date.Month - 1) / 3) + 1;
        return $"Q{quarter} {date.Year}";
    }

    private static string BuildStageGateStatus(IEnumerable<Gate> gates)
    {
        var gate = gates.OrderByDescending(x => x.GateNo).FirstOrDefault();

        if (gate is null)
        {
            return "-";
        }

        return gate.Status switch
        {
            GateStatus.Approved => $"G{gate.GateNo} ✓",
            GateStatus.WaitingApproval => $"G{gate.GateNo} Bekliyor",
            GateStatus.ReadyForSubmit => $"G{gate.GateNo} Hazır",
            GateStatus.MissingEvidence => $"G{gate.GateNo} Eksik Kanıt",
            GateStatus.Rejected => $"G{gate.GateNo} Ret",
            _ => $"G{gate.GateNo}"
        };
    }
}
