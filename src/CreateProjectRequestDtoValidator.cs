using PMO.Platform.Application.Gates;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IGateService
{
    Task<IReadOnlyList<GateListItemDto>> GetProjectGatesAsync(Guid projectId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<GateDetailDto?> GetGateDetailAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<GateDetailDto> SubmitGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
    Task<GateDetailDto> ApproveGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, string? note, CancellationToken cancellationToken = default);
    Task<GateDetailDto> RejectGateAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, string note, CancellationToken cancellationToken = default);
}
