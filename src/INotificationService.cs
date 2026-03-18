namespace PMO.Platform.Application.Auth;

public sealed class LoginRequestDto
{
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string Password { get; set; } = string.Empty;
}

public sealed class AuthenticatedUserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public sealed class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public AuthenticatedUserDto User { get; set; } = new();
    public IReadOnlyList<string> Roles { get; set; } = Array.Empty<string>();
}
