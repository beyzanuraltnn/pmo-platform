namespace PMO.Platform.Infrastructure.Options;

public sealed class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    public string RootFolder { get; set; } = "uploads";
    public string GatesFolder { get; set; } = "gates";
    public long MaxFileSizeInBytes { get; set; } = 5 * 1024 * 1024;
    public string[] AllowedExtensions { get; set; } = [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".xlsx", ".txt"];
}
