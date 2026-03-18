using FluentValidation;
using PMO.Platform.Application.Projects;
using PMO.Platform.Domain.Enums;

namespace PMO.Platform.Application.Validation;

public sealed class UpdateProjectRequestDtoValidator : AbstractValidator<UpdateProjectRequestDto>
{
    public UpdateProjectRequestDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Proje adı zorunludur.")
            .MaximumLength(200).WithMessage("Proje adı en fazla 200 karakter olabilir.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Proje kodu zorunludur.")
            .MaximumLength(50).WithMessage("Proje kodu en fazla 50 karakter olabilir.");

        RuleFor(x => x.Type)
            .Must(value => Enum.TryParse<ProjectType>(value, true, out _))
            .WithMessage("Geçersiz proje türü.");

        RuleFor(x => x.Status)
            .Must(value => Enum.TryParse<ProjectStatus>(value, true, out _))
            .WithMessage("Geçersiz proje durumu.");

        RuleFor(x => x.ProjectManagerId)
            .NotEmpty().WithMessage("Proje yöneticisi zorunludur.");

        RuleFor(x => x.Priority)
            .Must(value => Enum.TryParse<ProjectPriority>(value, true, out _))
            .WithMessage("Geçersiz proje önceliği.");

        RuleFor(x => x.RagStatus)
            .Must(value => Enum.TryParse<RagStatus>(value, true, out _))
            .WithMessage("Geçersiz RAG durumu.");

        RuleFor(x => x.Stage)
            .Must(value => Enum.TryParse<ProjectStage>(value, true, out _))
            .WithMessage("Geçersiz proje aşaması.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Proje açıklaması zorunludur.")
            .MaximumLength(2000).WithMessage("Proje açıklaması en fazla 2000 karakter olabilir.");

        RuleFor(x => x.BusinessOwner)
            .NotEmpty().WithMessage("Business owner zorunludur.")
            .MaximumLength(150).WithMessage("Business owner en fazla 150 karakter olabilir.");

        RuleFor(x => x.Sponsor)
            .NotEmpty().WithMessage("Sponsor zorunludur.")
            .MaximumLength(150).WithMessage("Sponsor en fazla 150 karakter olabilir.");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Departman zorunludur.")
            .MaximumLength(150).WithMessage("Departman en fazla 150 karakter olabilir.");

        RuleFor(x => x.Notes)
            .MaximumLength(2000).WithMessage("Not alanı en fazla 2000 karakter olabilir.");

        RuleFor(x => x)
            .Must(x => !x.PlannedStartDate.HasValue || !x.PlannedEndDate.HasValue || x.PlannedStartDate <= x.PlannedEndDate)
            .WithMessage("Planlanan başlangıç tarihi bitiş tarihinden büyük olamaz.");
    }
}
