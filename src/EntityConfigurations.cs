using FluentValidation;
using PMO.Platform.Application.Raid;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Application.Validation;

public sealed class CreateRaidItemRequestDtoValidator : AbstractValidator<CreateRaidItemRequestDto>
{
    public CreateRaidItemRequestDtoValidator()
    {
        RuleFor(x => x.Type)
            .Must(value => Enum.TryParse<RaidItemType>(value, true, out _))
            .WithMessage("Geçerli bir RAID türü seçilmelidir.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Başlık zorunludur.")
            .MaximumLength(200).WithMessage("Başlık en fazla 200 karakter olabilir.");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Açıklama en fazla 2000 karakter olabilir.");

        RuleFor(x => x.Status)
            .Must(value => Enum.TryParse<RaidStatus>(value, true, out _))
            .WithMessage("Geçerli bir RAID durumu seçilmelidir.");

        RuleFor(x => x.Owner)
            .NotEmpty().WithMessage("Sorumlu kişi zorunludur.")
            .MaximumLength(150).WithMessage("Sorumlu kişi en fazla 150 karakter olabilir.");

        RuleFor(x => x.ActionPlan)
            .MaximumLength(2000).WithMessage("Aksiyon planı en fazla 2000 karakter olabilir.");

        RuleFor(x => x.Note)
            .MaximumLength(1000).WithMessage("Not alanı en fazla 1000 karakter olabilir.");

        RuleFor(x => x)
            .Must(HasConditionalRiskFields)
            .WithMessage("Risk ve Issue kayıtlarında priority ve impact zorunludur.");

        RuleFor(x => x.Priority)
            .Must(value => string.IsNullOrWhiteSpace(value) || Enum.TryParse<RaidPriority>(value, true, out _))
            .WithMessage("Geçersiz RAID önceliği.");

        RuleFor(x => x.Impact)
            .Must(value => string.IsNullOrWhiteSpace(value) || Enum.TryParse<RaidImpact>(value, true, out _))
            .WithMessage("Geçersiz RAID etkisi.");
    }

    private static bool HasConditionalRiskFields(CreateRaidItemRequestDto request)
    {
        if (!Enum.TryParse<RaidItemType>(request.Type, true, out var type))
        {
            return false;
        }

        if (type is RaidItemType.Risk or RaidItemType.Issue)
        {
            return !string.IsNullOrWhiteSpace(request.Priority) && !string.IsNullOrWhiteSpace(request.Impact);
        }

        return true;
    }
}
