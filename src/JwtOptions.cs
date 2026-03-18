using FluentValidation;
using PMO.Platform.Application.Raid;

namespace PMO.Platform.Application.Validation;

public sealed class CloseRaidItemRequestDtoValidator : AbstractValidator<CloseRaidItemRequestDto>
{
    public CloseRaidItemRequestDtoValidator()
    {
        RuleFor(x => x.Note)
            .MaximumLength(1000)
            .WithMessage("Kapanış notu en fazla 1000 karakter olabilir.");
    }
}
