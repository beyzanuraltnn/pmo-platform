using PMO.Platform.Application.Projects;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectListItemDto>> GetProjectsAsync(GetProjectsQueryDto query, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto?> GetProjectDetailAsync(Guid id, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto> CreateProjectAsync(CreateProjectRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<ProjectDetailDto> UpdateProjectAsync(Guid id, UpdateProjectRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<ProjectSummaryDto?> GetProjectSummaryAsync(Guid id, CancellationToken cancellationToken = default);
    Task<DashboardSummaryDto> GetDashboardSummaryAsync(CancellationToken cancellationToken = default);
}
