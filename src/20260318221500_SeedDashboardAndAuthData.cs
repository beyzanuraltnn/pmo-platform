using FluentValidation;
using PMO.Platform.Application.Auth;

namespace PMO.Platform.Application.Validation;

public sealed class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Şifre zorunludur.");

        RuleFor(x => x)
            .Must(x => !string.IsNullOrWhiteSpace(x.Email) || !string.IsNullOrWhiteSpace(x.Username))
            .WithMessage("E-posta veya kullanıcı adı zorunludur.");
    }
}
