using FluentValidation;
using PMO.Platform.Application.Projects;

namespace PMO.Platform.Application.Validation;

public sealed class GetProjectsQueryDtoValidator : AbstractValidator<GetProjectsQueryDto>
{
    private static readonly string[] AllowedStatuses = { "Planned", "Active", "Completed", "Cancelled" };

    public GetProjectsQueryDtoValidator()
    {
        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrWhiteSpace(status) || AllowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Geçersiz proje durumu filtresi.");

        RuleFor(x => x.Search)
            .MaximumLength(100)
            .WithMessage("Arama metni en fazla 100 karakter olabilir.");
    }
}
