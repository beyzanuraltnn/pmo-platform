using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Infrastructure.Options;

namespace PMO.Platform.Infrastructure.Storage;

public sealed class LocalFileStorage(
    IWebHostEnvironment environment,
    IOptions<FileStorageOptions> options) : ILocalFileStorage
{
    public async Task<(string StoredFileName, string RelativePath, string ContentType, long FileSize)> SaveGateEvidenceAsync(
        Guid gateId,
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        var storageOptions = options.Value;
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!storageOptions.AllowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Dosya uzantısına izin verilmiyor.");
        }

        if (file.Length > storageOptions.MaxFileSizeInBytes)
        {
            throw new InvalidOperationException("Dosya boyutu limitin üzerinde.");
        }

        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        var folderPath = Path.Combine(webRoot, storageOptions.RootFolder, storageOptions.GatesFolder, gateId.ToString());
        Directory.CreateDirectory(folderPath);

        var storedFileName = $"{Guid.NewGuid():N}{extension}";
        var absolutePath = Path.Combine(folderPath, storedFileName);

        await using (var stream = new FileStream(absolutePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativePath = Path.Combine(storageOptions.RootFolder, storageOptions.GatesFolder, gateId.ToString(), storedFileName)
            .Replace("\\", "/");

        return (storedFileName, relativePath, file.ContentType, file.Length);
    }

    public Task DeleteAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        var absolutePath = Path.Combine(webRoot, relativePath.Replace("/", Path.DirectorySeparatorChar.ToString()));

        if (File.Exists(absolutePath))
        {
            File.Delete(absolutePath);
        }

        return Task.CompletedTask;
    }
}
