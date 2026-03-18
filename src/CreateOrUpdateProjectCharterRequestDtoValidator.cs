using PMO.Platform.Application.Gates;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IEvidenceService
{
    Task<EvidenceItemDto> UploadEvidenceAsync(Guid gateId, Guid userId, IReadOnlyList<string> roles, UploadEvidenceRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteEvidenceAsync(Guid gateId, Guid evidenceId, Guid userId, IReadOnlyList<string> roles, CancellationToken cancellationToken = default);
}
