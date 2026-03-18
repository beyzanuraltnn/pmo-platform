using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMO.Platform.Api.Common.Responses;
using PMO.Platform.Api.Extensions;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Gates;
using PMO.Platform.Infrastructure.Common.Interfaces;

namespace PMO.Platform.Api.Controllers;

[ApiController]
[Authorize]
public sealed class GatesController(
    IGateService gateService,
    IEvidenceService evidenceService,
    ICurrentUserService currentUserService,
    IValidator<UploadEvidenceRequestDto> uploadValidator,
    IValidator<RejectGateRequestDto> rejectValidator) : ControllerBase
{
    [HttpGet("api/projects/{projectId:guid}/gates")]
    public async Task<IActionResult> GetProjectGates(Guid projectId, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var gates = await gateService.GetProjectGatesAsync(projectId, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Gate listesi getirildi.", gates));
    }

    [HttpGet("api/gates/{gateId:guid}")]
    public async Task<IActionResult> GetGateDetail(Guid gateId, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var detail = await gateService.GetGateDetailAsync(gateId, userId, roles, cancellationToken);
        return detail is null
            ? NotFound(ApiResponse.Fail("Gate bulunamadı."))
            : Ok(ApiResponse.Ok("Gate detayı getirildi.", detail));
    }

    [HttpPost("api/gates/{gateId:guid}/evidences")]
    [RequestSizeLimit(10_485_760)]
    public async Task<IActionResult> UploadEvidence(Guid gateId, [FromForm] UploadEvidenceRequestDto request, CancellationToken cancellationToken)
    {
        await uploadValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var result = await evidenceService.UploadEvidenceAsync(gateId, userId, roles, request, cancellationToken);
        return Ok(ApiResponse.Ok("Kanıt dosyası yüklendi.", result));
    }

    [HttpDelete("api/gates/{gateId:guid}/evidences/{evidenceId:guid}")]
    public async Task<IActionResult> DeleteEvidence(Guid gateId, Guid evidenceId, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var deleted = await evidenceService.DeleteEvidenceAsync(gateId, evidenceId, userId, roles, cancellationToken);
        return deleted
            ? Ok(ApiResponse.Ok("Kanıt dosyası silindi."))
            : NotFound(ApiResponse.Fail("Kanıt dosyası bulunamadı."));
    }

    [HttpPost("api/gates/{gateId:guid}/submit")]
    public async Task<IActionResult> SubmitGate(Guid gateId, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var result = await gateService.SubmitGateAsync(gateId, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Gate onaya gönderildi.", result));
    }

    [HttpPost("api/gates/{gateId:guid}/approve")]
    public async Task<IActionResult> ApproveGate(Guid gateId, [FromBody] ApproveGateRequestDto? request, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var result = await gateService.ApproveGateAsync(gateId, userId, roles, request?.Note, cancellationToken);
        return Ok(ApiResponse.Ok("Gate onayı kaydedildi.", result));
    }

    [HttpPost("api/gates/{gateId:guid}/reject")]
    public async Task<IActionResult> RejectGate(Guid gateId, [FromBody] RejectGateRequestDto request, CancellationToken cancellationToken)
    {
        await rejectValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var result = await gateService.RejectGateAsync(gateId, userId, roles, request.Note, cancellationToken);
        return Ok(ApiResponse.Ok("Gate reddedildi.", result));
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
