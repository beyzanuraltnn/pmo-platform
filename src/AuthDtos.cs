using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMO.Platform.Api.Common.Responses;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Raid;
using PMO.Platform.Infrastructure.Common.Interfaces;

namespace PMO.Platform.Api.Controllers;

[ApiController]
[Authorize]
public sealed class RaidController(
    IRaidService raidService,
    ICurrentUserService currentUserService,
    IValidator<GetRaidItemsQueryDto> queryValidator,
    IValidator<CreateRaidItemRequestDto> createValidator,
    IValidator<UpdateRaidItemRequestDto> updateValidator,
    IValidator<CloseRaidItemRequestDto> closeValidator) : ControllerBase
{
    [HttpGet("api/projects/{projectId:guid}/raid")]
    public async Task<IActionResult> GetProjectRaid(Guid projectId, [FromQuery] GetRaidItemsQueryDto query, CancellationToken cancellationToken)
    {
        await queryValidator.ValidateAndThrowAsync(query, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var items = await raidService.GetProjectRaidItemsAsync(projectId, query, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("RAID kayıtları getirildi.", items));
    }

    [HttpGet("api/projects/{projectId:guid}/raid/summary")]
    public async Task<IActionResult> GetProjectRaidSummary(Guid projectId, CancellationToken cancellationToken)
    {
        var summary = await raidService.GetProjectRaidSummaryAsync(projectId, cancellationToken);
        return Ok(ApiResponse.Ok("RAID özeti getirildi.", summary));
    }

    [HttpGet("api/raid/{id:guid}")]
    public async Task<IActionResult> GetRaidItem(Guid id, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var item = await raidService.GetRaidItemAsync(id, userId, roles, cancellationToken);
        return item is null
            ? NotFound(ApiResponse.Fail("RAID kaydı bulunamadı."))
            : Ok(ApiResponse.Ok("RAID detayı getirildi.", item));
    }

    [HttpPost("api/projects/{projectId:guid}/raid")]
    public async Task<IActionResult> CreateRaidItem(Guid projectId, [FromBody] CreateRaidItemRequestDto request, CancellationToken cancellationToken)
    {
        await createValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var item = await raidService.CreateRaidItemAsync(projectId, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("RAID kaydı oluşturuldu.", item));
    }

    [HttpPut("api/raid/{id:guid}")]
    public async Task<IActionResult> UpdateRaidItem(Guid id, [FromBody] UpdateRaidItemRequestDto request, CancellationToken cancellationToken)
    {
        await updateValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var item = await raidService.UpdateRaidItemAsync(id, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("RAID kaydı güncellendi.", item));
    }

    [HttpPut("api/raid/{id:guid}/close")]
    public async Task<IActionResult> CloseRaidItem(Guid id, [FromBody] CloseRaidItemRequestDto? request, CancellationToken cancellationToken)
    {
        request ??= new CloseRaidItemRequestDto();
        await closeValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var item = await raidService.CloseRaidItemAsync(id, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("RAID kaydı kapatıldı.", item));
    }

    private (Guid UserId, IReadOnlyList<string> Roles) GetCurrentUserContext()
    {
        var userId = currentUserService.GetCurrentUserId();
        if (!userId.HasValue)
        {
            throw new UnauthorizedAccessException("Kullanıcı doğrulanamadı.");
        }

        var roles = User.FindAll(ClaimTypes.Role).Select(x => x.Value).Distinct().ToList();
        return (userId.Value, roles);
    }
}
