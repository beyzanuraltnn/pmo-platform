using PMO.Platform.Application.Raid;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IRaidService
{
    Task<IReadOnlyList<RaidListItemDto>> GetProjectRaidItemsAsync(Guid projectId, GetRaidItemsQueryDto query, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<RaidDetailDto?> GetRaidItemAsync(Guid id, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<RaidDetailDto> CreateRaidItemAsync(Guid projectId, CreateRaidItemRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<RaidDetailDto> UpdateRaidItemAsync(Guid id, UpdateRaidItemRequestDto request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<RaidDetailDto> CloseRaidItemAsync(Guid id, CloseRaidItemRequestDto? request, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<RaidSummaryDto> GetProjectRaidSummaryAsync(Guid projectId, CancellationToken cancellationToken = default);
}
