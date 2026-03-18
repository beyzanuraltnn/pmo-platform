using Microsoft.AspNetCore.Http;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface ILocalFileStorage
{
    Task<(string StoredFileName, string RelativePath, string ContentType, long FileSize)> SaveGateEvidenceAsync(Guid gateId, IFormFile file, CancellationToken cancellationToken = default);
    Task DeleteAsync(string relativePath, CancellationToken cancellationToken = default);
}
