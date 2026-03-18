namespace PMO.Platform.Api.Common.Responses;

public class ApiResponse
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public object? Errors { get; init; }
    public object? Data { get; init; }

    public static ApiResponse Ok(string message = "İşlem başarılı.", object? data = null) =>
        new()
        {
            Success = true,
            Message = message,
            Data = data
        };

    public static ApiResponse Fail(string message, object? errors = null) =>
        new()
        {
            Success = false,
            Message = message,
            Errors = errors
        };
}
