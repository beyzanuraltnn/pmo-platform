using PMO.Platform.Application.Auth;

namespace PMO.Platform.Application.Common.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
}
