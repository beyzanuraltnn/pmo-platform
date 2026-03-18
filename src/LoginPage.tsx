using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Projects;
using PMO.Platform.Domain.Entities;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Infrastructure.Services;

public sealed class ProjectCharterService(IApplicationDbContext dbContext) : IProjectCharterService
{
    public async Task<ProjectCharterDetailDto> GetProjectCharterAsync(Guid projectId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        var project = await dbContext.Projects
            .AsNoTracking()
            .Include(x => x.Charter)
            .SingleOrDefaultAsync(x => x.Id == projectId, cancellationToken)
            ?? throw new InvalidOperationException("Proje bulunamadı.");

        return ProjectMappingHelper.MapCharter(project.Charter, projectId, CanManage(roles));
    }

    public async Task<ProjectCharterDetailDto> CreateProjectCharterAsync(Guid projectId, CreateOrUpdateProjectCharterRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var project = await dbContext.Projects
            .Include(x => x.Charter)
            .SingleOrDefaultAsync(x => x.Id == projectId, cancellationToken)
            ?? throw new InvalidOperationException("Proje bulunamadı.");

        if (project.Charter is not null)
        {
            throw new InvalidOperationException("Bu proje için zaten aktif charter kaydı var.");
        }

        var charter = new ProjectCharter
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId
        };

        ApplyValues(charter, request, incrementVersion: false);

        await dbContext.ProjectCharters.AddAsync(charter, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ProjectMappingHelper.MapCharter(charter, projectId, true);
    }

    public async Task<ProjectCharterDetailDto> UpdateProjectCharterAsync(Guid projectId, CreateOrUpdateProjectCharterRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default)
    {
        EnsureCanManage(roles);

        var charter = await dbContext.ProjectCharters
            .SingleOrDefaultAsync(x => x.ProjectId == projectId, cancellationToken)
            ?? throw new InvalidOperationException("Charter kaydı bulunamadı.");

        ApplyValues(charter, request, incrementVersion: true);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ProjectMappingHelper.MapCharter(charter, projectId, true);
    }

    private static void ApplyValues(ProjectCharter charter, CreateOrUpdateProjectCharterRequestDto request, bool incrementVersion)
    {
        charter.Purpose = request.Purpose.Trim();
        charter.Objectives = request.Objectives.Trim();
        charter.Scope = request.Scope.Trim();
        charter.OutOfScope = request.OutOfScope.Trim();
        charter.SuccessCriteria = request.SuccessCriteria.Trim();
        charter.RisksAndAssumptions = request.RisksAndAssumptions.Trim();
        charter.Dependencies = request.Dependencies.Trim();
        charter.Stakeholders = request.Stakeholders.Trim();
        charter.TimelineSummary = request.TimelineSummary.Trim();
        charter.BudgetSummary = request.BudgetSummary.Trim();
        charter.ApprovalNotes = request.ApprovalNotes.Trim();
        charter.LastReviewedAt = DateTime.UtcNow;
        charter.Version = incrementVersion ? charter.Version + 1 : Math.Max(1, charter.Version);
    }

    private static bool CanManage(IReadOnlyList<string> roles)
    {
        return roles.Contains(SystemRoles.PmoAdmin) || roles.Contains(SystemRoles.ProjectManager);
    }

    private static void EnsureCanManage(IReadOnlyList<string> roles)
    {
        if (!CanManage(roles))
        {
            throw new UnauthorizedAccessException("Bu işlem için charter yönetim yetkisi gerekir.");
        }
    }
}
