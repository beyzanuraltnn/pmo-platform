using FluentValidation;
using PMO.Platform.Application.Projects;

namespace PMO.Platform.Application.Validation;

public sealed class CreateOrUpdateProjectCharterRequestDtoValidator : AbstractValidator<CreateOrUpdateProjectCharterRequestDto>
{
    public CreateOrUpdateProjectCharterRequestDtoValidator()
    {
        RuleFor(x => x.Purpose)
            .NotEmpty().WithMessage("Charter amacı zorunludur.")
            .MaximumLength(1000).WithMessage("Charter amacı en fazla 1000 karakter olabilir.");

        RuleFor(x => x.Objectives)
            .NotEmpty().WithMessage("Hedefler zorunludur.")
            .MaximumLength(2000).WithMessage("Hedefler en fazla 2000 karakter olabilir.");

        RuleFor(x => x.Scope)
            .NotEmpty().WithMessage("Scope zorunludur.")
            .MaximumLength(2000).WithMessage("Scope en fazla 2000 karakter olabilir.");

        RuleFor(x => x.OutOfScope)
            .NotEmpty().WithMessage("Out of scope alanı zorunludur.")
            .MaximumLength(2000).WithMessage("Out of scope alanı en fazla 2000 karakter olabilir.");

        RuleFor(x => x.SuccessCriteria)
            .NotEmpty().WithMessage("Başarı kriterleri zorunludur.")
            .MaximumLength(2000).WithMessage("Başarı kriterleri en fazla 2000 karakter olabilir.");

        RuleFor(x => x.RisksAndAssumptions)
            .NotEmpty().WithMessage("Risk ve varsayımlar zorunludur.")
            .MaximumLength(4000).WithMessage("Risk ve varsayımlar en fazla 4000 karakter olabilir.");

        RuleFor(x => x.Dependencies)
            .NotEmpty().WithMessage("Bağımlılıklar zorunludur.")
            .MaximumLength(4000).WithMessage("Bağımlılıklar en fazla 4000 karakter olabilir.");

        RuleFor(x => x.Stakeholders)
            .NotEmpty().WithMessage("Paydaşlar zorunludur.")
            .MaximumLength(2000).WithMessage("Paydaşlar en fazla 2000 karakter olabilir.");

        RuleFor(x => x.TimelineSummary)
            .NotEmpty().WithMessage("Timeline özeti zorunludur.")
            .MaximumLength(2000).WithMessage("Timeline özeti en fazla 2000 karakter olabilir.");

        RuleFor(x => x.BudgetSummary)
            .NotEmpty().WithMessage("Bütçe özeti zorunludur.")
            .MaximumLength(2000).WithMessage("Bütçe özeti en fazla 2000 karakter olabilir.");

        RuleFor(x => x.ApprovalNotes)
            .MaximumLength(2000).WithMessage("Onay notları en fazla 2000 karakter olabilir.");
    }
}
