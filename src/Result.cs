namespace PMO.Platform.Application.Common.Exceptions;

public sealed class ValidationException : Exception
{
    public ValidationException(IDictionary<string, string[]> errors)
        : base("Doğrulama hatası oluştu.")
    {
        Errors = errors;
    }

    public IDictionary<string, string[]> Errors { get; }
}
