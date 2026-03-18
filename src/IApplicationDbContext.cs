using FluentValidation;
using PMO.Platform.Application.Common.Exceptions;

namespace PMO.Platform.Api.Extensions;

public static class ValidationExtensions
{
    public static async Task ValidateAndThrowAsync<T>(this IValidator<T> validator, T model, CancellationToken cancellationToken = default)
    {
        var result = await validator.ValidateAsync(model, cancellationToken);

        if (result.IsValid)
        {
            return;
        }

        var errors = result.Errors
            .GroupBy(x => x.PropertyName)
            .ToDictionary(
                group => group.Key,
                group => group.Select(error => error.ErrorMessage).Distinct().ToArray());

        throw new ValidationException(errors);
    }
}
