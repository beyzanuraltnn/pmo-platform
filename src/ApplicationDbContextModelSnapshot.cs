using FluentValidation;
using PMO.Platform.Application.Gates;

namespace PMO.Platform.Application.Validation;

public sealed class UploadEvidenceRequestDtoValidator : AbstractValidator<UploadEvidenceRequestDto>
{
    public UploadEvidenceRequestDtoValidator()
    {
        RuleFor(x => x.File)
            .NotNull()
            .WithMessage("Dosya zorunludur.");

        RuleFor(x => x.Category)
            .NotEmpty()
            .WithMessage("Kategori zorunludur.");
    }
}
