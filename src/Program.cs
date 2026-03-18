using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PMO.Platform.Api.Common.Responses;
using PMO.Platform.Application.Common.Interfaces.Services;
using PMO.Platform.Application.Projects;
using PMO.Platform.Infrastructure.Common.Interfaces;
using System.Security.Claims;

namespace PMO.Platform.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class ProjectsController(
    IProjectService projectService,
    IProjectCharterService projectCharterService,
    ICurrentUserService currentUserService,
    IValidator<GetProjectsQueryDto> queryValidator,
    IValidator<CreateProjectRequestDto> createProjectValidator,
    IValidator<UpdateProjectRequestDto> updateProjectValidator,
    IValidator<CreateOrUpdateProjectCharterRequestDto> charterValidator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetProjects([FromQuery] GetProjectsQueryDto query, CancellationToken cancellationToken)
    {
        await queryValidator.ValidateAndThrowAsync(query, cancellationToken);

        var projects = await projectService.GetProjectsAsync(query, cancellationToken);
        return Ok(ApiResponse.Ok("Proje listesi getirildi.", projects));
    }

    [HttpGet("dashboard-summary")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardSummary(CancellationToken cancellationToken)
    {
        var summary = await projectService.GetDashboardSummaryAsync(cancellationToken);
        return Ok(ApiResponse.Ok("Dashboard özeti getirildi.", summary));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProjectDetail(Guid id, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var project = await projectService.GetProjectDetailAsync(id, userId, roles, cancellationToken);
        return project is null
            ? NotFound(ApiResponse.Fail("Proje bulunamadı."))
            : Ok(ApiResponse.Ok("Proje detayı getirildi.", project));
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequestDto request, CancellationToken cancellationToken)
    {
        await createProjectValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var project = await projectService.CreateProjectAsync(request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Proje oluşturuldu.", project));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectRequestDto request, CancellationToken cancellationToken)
    {
        await updateProjectValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var project = await projectService.UpdateProjectAsync(id, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Proje güncellendi.", project));
    }

    [HttpGet("{id:guid}/summary")]
    public async Task<IActionResult> GetProjectSummary(Guid id, CancellationToken cancellationToken)
    {
        var summary = await projectService.GetProjectSummaryAsync(id, cancellationToken);
        return summary is null
            ? NotFound(ApiResponse.Fail("Proje bulunamadı."))
            : Ok(ApiResponse.Ok("Proje özeti getirildi.", summary));
    }

    [HttpGet("{id:guid}/charter")]
    public async Task<IActionResult> GetProjectCharter(Guid id, CancellationToken cancellationToken)
    {
        var (userId, roles) = GetCurrentUserContext();
        var charter = await projectCharterService.GetProjectCharterAsync(id, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Project charter getirildi.", charter));
    }

    [HttpPost("{id:guid}/charter")]
    public async Task<IActionResult> CreateProjectCharter(Guid id, [FromBody] CreateOrUpdateProjectCharterRequestDto request, CancellationToken cancellationToken)
    {
        await charterValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var charter = await projectCharterService.CreateProjectCharterAsync(id, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Project charter oluşturuldu.", charter));
    }

    [HttpPut("{id:guid}/charter")]
    public async Task<IActionResult> UpdateProjectCharter(Guid id, [FromBody] CreateOrUpdateProjectCharterRequestDto request, CancellationToken cancellationToken)
    {
        await charterValidator.ValidateAndThrowAsync(request, cancellationToken);
        var (userId, roles) = GetCurrentUserContext();
        var charter = await projectCharterService.UpdateProjectCharterAsync(id, request, userId, roles, cancellationToken);
        return Ok(ApiResponse.Ok("Project charter güncellendi.", charter));
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
