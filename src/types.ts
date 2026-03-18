namespace PMO.Platform.Infrastructure.Options;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "PMO.Platform";
    public string Audience { get; set; } = "PMO.Platform.Client";
    public string SecretKey { get; set; } = "ChangeThisSecretKeyForProduction123!";
    public int ExpirationMinutes { get; set; } = 60;
}
