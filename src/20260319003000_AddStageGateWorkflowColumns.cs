using FluentValidation;
using PMO.Platform.Application.Gates;

namespace PMO.Platform.Application.Validation;

public sealed class RejectGateRequestDtoValidator : AbstractValidator<RejectGateRequestDto>
{
    public RejectGateRequestDtoValidator()
    {
        RuleFor(x => x.Note)
            .NotEmpty()
            .WithMessage("Ret notu zorunludur.")
            .MaximumLength(1000)
            .WithMessage("Ret notu en fazla 1000 karakter olabilir.");
    }
}
