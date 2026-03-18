using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Projects;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

public sealed class ProjectService(IApplicationDbContext dbContext) : IProjectService
{
    public async Task<IReadOnlyList<ProjectListItemDto>> GetProjectsAsync(GetProjectsQueryDto query, CancellationToken cancellationToken = default)
    {
        var projectsQuery = dbContext.Projects
            .AsNoTracking()
            .Include(x => x.ProjectManager)
            .Include(x => x.Gates)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Status) && Enum.TryParse<ProjectStatus>(query.Status, true, out var status))
        {
            projectsQuery = projectsQuery.Where(x => x.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            projectsQuery = projectsQuery.Where(x =>
                x.Name.ToLower().Contains(search) ||
                x.Code.ToLower().Contains(search) ||
                (x.ProjectManager.FirstName + " " + x.ProjectManager.LastName).ToLower().Contains(search));
        }

        var projects = await projectsQuery
            .OrderBy(x => x.ExpectedGoLiveDate)
            .ToListAsync(cancellationToken);

        return projects.Select(ProjectMappingHelper.MapProject).ToList();
    }

    public async Task<ProjectDetailDto?> GetProjectDetailAsync(Guid id, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var project = await LoadProjectAsync(id, cancellationToken);
        return project is null ? null : ProjectMappingHelper.MapProjectDetail(project, CanEditProject(roles));
    }

    public async Task<ProjectDetailDto> CreateProjectAsync(CreateProjectRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);
        await EnsureProjectManagerExists(request.ProjectManagerId, cancellationToken);

        var code = request.Code.Trim().ToUpperInvariant();
        var existingCode = await dbContext.Projects.AsNoTracking().AnyAsync(x => x.Code.ToUpper() == code, cancellationToken);
        if (existingCode)
        {
            throw new InvalidOperationException("Bu proje kodu zaten kullanılıyor.");
        }

        var project = new Project();
        ApplyProjectValues(project, request, code);
        project.Id = Guid.NewGuid();

        await dbContext.Projects.AddAsync(project, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var createdProject = await LoadProjectAsync(project.Id, cancellationToken)
            ?? throw new InvalidOperationException("Oluşturulan proje yüklenemedi.");

        return ProjectMappingHelper.MapProjectDetail(createdProject, CanEditProject(roles));
    }

    public async Task<ProjectDetailDto> UpdateProjectAsync(Guid id, UpdateProjectRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var project = await dbContext.Projects
            .Include(x => x.ProjectManager)
            .Include(x => x.Charter)
            .Include(x => x.Gates)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new InvalidOperationException("Proje bulunamadı.");

        await EnsureProjectManagerExists(request.ProjectManagerId, cancellationToken);

        var code = request.Code.Trim().ToUpperInvariant();
        var existingCode = await dbContext.Projects
            .AsNoTracking()
            .AnyAsync(x => x.Id != id && x.Code.ToUpper() == code, cancellationToken);

        if (existingCode)
        {
            throw new InvalidOperationException("Bu proje kodu zaten kullanılıyor.");
        }

        ApplyProjectValues(project, request, code);
        await dbContext.SaveChangesAsync(cancellationToken);

        var updatedProject = await LoadProjectAsync(id, cancellationToken)
            ?? throw new InvalidOperationException("Güncellenen proje yüklenemedi.");

        return ProjectMappingHelper.MapProjectDetail(updatedProject, true);
    }

    public async Task<ProjectSummaryDto?> GetProjectSummaryAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var project = await dbContext.Projects
            .AsNoTracking()
            .Include(x => x.Gates)
            .Include(x => x.Notifications)
            .Include(x => x.Charter)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (project is null)
        {
            return null;
        }

        var latestGate = project.Gates.OrderByDescending(x => x.GateNo).FirstOrDefault();

        return new ProjectSummaryDto
        {
            ProjectId = project.Id,
            ProjectName = project.Name,
            CharterExists = project.Charter is not null,
            LatestGateStatus = latestGate?.Status.ToString() ?? "-",
            NotificationCount = project.Notifications.Count
        };
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(CancellationToken cancellationToken = default)
    {
        var projects = await dbContext.Projects
            .AsNoTracking()
            .Include(x => x.ProjectManager)
            .Include(x => x.Gates)
            .ToListAsync(cancellationToken);

        var activeProjects = projects.Where(x => x.Status == ProjectStatus.Active).ToList();
        var plannedProjects = projects.Where(x => x.Status == ProjectStatus.Planned).ToList();
        var completedProjects = projects.Where(x => x.Status == ProjectStatus.Completed).ToList();

        var now = DateTime.UtcNow.Date;
        var startOfWeek = now.AddDays(-(int)(now.DayOfWeek == DayOfWeek.Sunday ? 6 : now.DayOfWeek - DayOfWeek.Monday));
        var endOfWeek = startOfWeek.AddDays(6);

        var criticalProjects = activeProjects.Where(x => x.RagStatus == RagStatus.Red).ToList();
        var overdueProjects = activeProjects.Where(x => x.ExpectedGoLiveDate.HasValue && x.ExpectedGoLiveDate.Value.Date < now).ToList();
        var pendingGates = activeProjects
            .SelectMany(x => x.Gates)
            .Where(x => x.Status == GateStatus.WaitingApproval)
            .ToList();

        var weeklyGoLiveProjects = projects
            .Where(x => x.ExpectedGoLiveDate.HasValue && x.ExpectedGoLiveDate.Value.Date >= startOfWeek && x.ExpectedGoLiveDate.Value.Date <= endOfWeek)
            .ToList();

        var delayedMilestones = overdueProjects
            .Take(3)
            .Select(project => new DelayedMilestoneDto
            {
                ProjectName = project.Name,
                MilestoneName = $"{ProjectMappingHelper.TranslateStage(project.Stage)} Tamamlanması",
                PlannedDateText = ProjectMappingHelper.FormatDate(project.ExpectedGoLiveDate),
                NewTargetDateText = project.ExpectedGoLiveDate?.AddDays(14).ToString("dd MMM", new System.Globalization.CultureInfo("tr-TR")) ?? "-"
            })
            .ToList();

        return new DashboardSummaryDto
        {
            ActiveProjectCount = activeProjects.Count,
            PlannedProjectCount = plannedProjects.Count,
            CompletedProjectCount = completedProjects.Count,
            CriticalRiskCount = criticalProjects.Count,
            OverdueMilestoneCount = delayedMilestones.Count,
            PendingApprovalCount = pendingGates.Count,
            GoLiveThisWeek = weeklyGoLiveProjects.Count,
            SummaryCards = new[]
            {
                new DashboardSummaryCardDto { Label = "Aktif Projeler", Value = activeProjects.Count, Note = "Toplam portföy", Tone = "blue" },
                new DashboardSummaryCardDto { Label = "Planlanan", Value = plannedProjects.Count, Note = "Planlama havuzu", Tone = "green" },
                new DashboardSummaryCardDto { Label = "Tamamlanan", Value = completedProjects.Count, Note = "Kapanış arşivi", Tone = "yellow" },
                new DashboardSummaryCardDto { Label = "Bekleyen Onay", Value = pendingGates.Count, Note = "Stage gate aksiyonu", Tone = "red" }
            },
            DashboardProjects = activeProjects.Take(5).Select(MapDashboardProject).ToList(),
            ActiveProjects = activeProjects.Take(5).Select(MapDashboardProject).ToList(),
            WeeklyGoLives = weeklyGoLiveProjects.Take(5).Select(project => new WeeklyGoLiveDto
            {
                ProjectName = project.Name,
                DateText = ProjectMappingHelper.FormatDate(project.ExpectedGoLiveDate),
                StatusText = project.Status == ProjectStatus.Completed ? "Tamamlandı" : "Hazır",
                Note = project.RagStatus == RagStatus.Red ? "Yakından takip gerekiyor" : "Planlandığı gibi ilerliyor"
            }).ToList(),
            DelayedMilestones = delayedMilestones,
            CriticalRisks = criticalProjects.Take(5).Select(project => new CriticalRiskDto
            {
                ProjectName = project.Name,
                RiskText = $"{ProjectMappingHelper.TranslateStage(project.Stage)} aşamasında kritik risk tespit edildi",
                ImpactLevel = "Yüksek",
                ActionText = "Yönetim aksiyonu bekleniyor"
            }).ToList(),
            ActionItems = BuildActionItems(activeProjects, pendingGates)
        };
    }

    private async Task<Project?> LoadProjectAsync(Guid id, CancellationToken cancellationToken)
    {
        return await dbContext.Projects
            .AsNoTracking()
            .Include(x => x.ProjectManager)
            .Include(x => x.Charter)
            .Include(x => x.Gates)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    private static DashboardProjectDto MapDashboardProject(Project project)
    {
        return new DashboardProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Type = ProjectMappingHelper.TranslateProjectType(project.Type),
            ProjectManager = $"{project.ProjectManager.FirstName[0]}. {project.ProjectManager.LastName}",
            Stage = ProjectMappingHelper.TranslateStage(project.Stage),
            RagStatus = project.RagStatus.ToString().ToLowerInvariant(),
            GoLiveDateText = ProjectMappingHelper.FormatGoLiveDate(project),
            RiskLevel = ProjectMappingHelper.TranslateRiskLevel(project.RagStatus)
        };
    }

    private static IReadOnlyList<DashboardActionItemDto> BuildActionItems(IReadOnlyList<Project> activeProjects, IReadOnlyList<Gate> pendingGates)
    {
        var items = pendingGates
            .Take(3)
            .Select(gate => new DashboardActionItemDto
            {
                Title = $"{activeProjects.FirstOrDefault(project => project.Id == gate.ProjectId)?.Name ?? "Proje"} — Gate {gate.GateNo} onayı bekliyor",
                Body = $"Durum: {gate.Status} · Açılış: {gate.OpenedAt:dd.MM.yyyy}",
                ButtonText = "→ Gate'e Git",
                Tone = gate.Status == GateStatus.WaitingApproval ? "red" : "yellow"
            })
            .ToList();

        if (items.Count == 0)
        {
            items = activeProjects
                .Where(x => x.RagStatus != RagStatus.Green)
                .Take(2)
                .Select(project => new DashboardActionItemDto
                {
                    Title = $"{project.Name} — Yakın takip gerekli",
                    Body = $"RAG durumu: {project.RagStatus}",
                    ButtonText = "→ Projeyi Aç",
                    Tone = project.RagStatus == RagStatus.Red ? "red" : "yellow"
                })
                .ToList();
        }

        return items;
    }

    private static bool CanEditProject(IReadOnlyList<string> roles)
    {
        return roles.Contains(SystemRoles.PmoAdmin) || roles.Contains(SystemRoles.ProjectManager);
    }

    private static void EnsureCanManage(IReadOnlyList<string> roles)
    {
        if (!CanEditProject(roles))
        {
            throw new UnauthorizedAccessException("Bu işlem için proje yönetim yetkisi gerekir.");
        }
    }

    private async Task EnsureProjectManagerExists(Guid projectManagerId, CancellationToken cancellationToken)
    {
        var exists = await dbContext.Users.AsNoTracking().AnyAsync(x => x.Id == projectManagerId && x.IsActive, cancellationToken);
        if (!exists)
        {
            throw new InvalidOperationException("Geçerli bir proje yöneticisi seçilmelidir.");
        }
    }

    private static void ApplyProjectValues(Project project, CreateProjectRequestDto request, string normalizedCode)
    {
        project.Name = request.Name.Trim();
        project.Code = normalizedCode;
        project.Type = Enum.Parse<ProjectType>(request.Type, true);
        project.Status = Enum.Parse<ProjectStatus>(request.Status, true);
        project.Description = request.Description.Trim();
        project.BusinessOwner = request.BusinessOwner.Trim();
        project.ProjectManagerId = request.ProjectManagerId;
        project.Sponsor = request.Sponsor.Trim();
        project.Priority = Enum.Parse<ProjectPriority>(request.Priority, true);
        project.RagStatus = Enum.Parse<RagStatus>(request.RagStatus, true);
        project.Stage = Enum.Parse<ProjectStage>(request.Stage, true);
        project.PlannedStartDate = request.PlannedStartDate;
        project.PlannedEndDate = request.PlannedEndDate;
        project.ExpectedGoLiveDate = request.ExpectedGoLiveDate;
        project.ActualGoLiveDate = request.ActualGoLiveDate;
        project.Budget = request.Budget;
        project.Department = request.Department.Trim();
        project.Notes = request.Notes.Trim();
    }
}
