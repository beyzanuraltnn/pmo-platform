using PMO.Platform.Application.Projects;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IProjectCharterService
{
    Task<ProjectCharterDetailDto> GetProjectCharterAsync(Guid projectId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<ProjectCharterDetailDto> CreateProjectCharterAsync(Guid projectId, CreateOrUpdateProjectCharterRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<ProjectCharterDetailDto> UpdateProjectCharterAsync(Guid projectId, CreateOrUpdateProjectCharterRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
}
