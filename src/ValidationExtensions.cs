using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMO.Platform.Api.Common.Responses;
using PMO.Platform.Api.Extensions;
using PMO.Platform.Application.Auth;
using PMO.Platform.Application.Common.Interfaces.Services;

namespace PMO.Platform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(
    IAuthService authService,
    IValidator<LoginRequestDto> loginValidator) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        await loginValidator.ValidateAndThrowAsync(request, cancellationToken);

        var response = await authService.LoginAsync(request, cancellationToken);

        if (response is null)
        {
            return Unauthorized(ApiResponse.Fail("Kullanıcı adı/e-posta veya şifre hatalı."));
        }

        return Ok(ApiResponse.Ok("Giriş başarılı.", response));
    }
}
