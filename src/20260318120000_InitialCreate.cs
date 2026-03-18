using FluentValidation;
using PMO.Platform.Application.Raid;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Application.Validation;

public sealed class GetRaidItemsQueryDtoValidator : AbstractValidator<GetRaidItemsQueryDto>
{
    public GetRaidItemsQueryDtoValidator()
    {
        RuleFor(x => x.Type)
            .Must(value => string.IsNullOrWhiteSpace(value) || Enum.TryParse<RaidItemType>(value, true, out _))
            .WithMessage("Geçersiz RAID türü filtresi.");

        RuleFor(x => x.Status)
            .Must(value => string.IsNullOrWhiteSpace(value) || Enum.TryParse<RaidStatus>(value, true, out _))
            .WithMessage("Geçersiz RAID durum filtresi.");

        RuleFor(x => x.Priority)
            .Must(value => string.IsNullOrWhiteSpace(value) || Enum.TryParse<RaidPriority>(value, true, out _))
            .WithMessage("Geçersiz RAID öncelik filtresi.");

        RuleFor(x => x.Search)
            .MaximumLength(100)
            .WithMessage("Arama metni en fazla 100 karakter olabilir.");
    }
}
