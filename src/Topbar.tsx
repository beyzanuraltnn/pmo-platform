using Microsoft.EntityFrameworkCore;
using PMO.Platform.Application.Auth;
using PMO.Platform.Application.Common.Interfaces;
using PMO.Platform.Application.Common.Interfaces.Security;
using PMO.Platform.Application.Common.Interfaces.Services;

namespace PMO.Platform.Infrastructure.Services;

public sealed class AuthService(
    IApplicationDbContext dbContext,
    IPasswordHasher passwordHasher,
    IJwtTokenGenerator jwtTokenGenerator) : IAuthService
{
    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var identifier = !string.IsNullOrWhiteSpace(request.Email)
            ? request.Email.Trim()
            : request.Username?.Trim();

        if (string.IsNullOrWhiteSpace(identifier))
        {
            return null;
        }

        var user = await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(
                x => x.Email.ToLower() == identifier.ToLower()
                    || x.Email.ToLower().StartsWith($"{identifier.ToLower()}@"),
                cancellationToken);

        if (user is null || !user.IsActive || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        var roles = await dbContext.UserRoles
            .Where(x => x.UserId == user.Id)
            .Join(dbContext.Roles, userRole => userRole.RoleId, role => role.Id, (_, role) => role.Name)
            .ToListAsync(cancellationToken);

        return new LoginResponseDto
        {
            Token = jwtTokenGenerator.GenerateToken(user, roles),
            RefreshToken = null,
            Roles = roles,
            User = new AuthenticatedUserDto
            {
                Id = user.Id,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Email = user.Email,
                Role = roles.FirstOrDefault() ?? string.Empty
            }
        };
    }
}
