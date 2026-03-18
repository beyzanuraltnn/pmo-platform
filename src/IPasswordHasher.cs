using System.Net;
using System.Text.Json;
using PMO.Platform.Application.Common.Exceptions;
using PMO.Platform.Api.Common.Responses;

namespace PMO.Platform.Api.Middleware;

public sealed class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Beklenmeyen bir hata oluştu.");
            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            ValidationException => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Forbidden,
            InvalidOperationException => (int)HttpStatusCode.BadRequest,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var response = exception switch
        {
            ValidationException validationException => ApiResponse.Fail(
                "Doğrulama hatası oluştu.",
                validationException.Errors),
            UnauthorizedAccessException => ApiResponse.Fail(
                "Bu işlem için yetkiniz yok.",
                new[] { exception.Message }),
            InvalidOperationException => ApiResponse.Fail(
                exception.Message,
                new[] { exception.Message }),
            _ => ApiResponse.Fail(
                "Beklenmeyen bir hata oluştu.",
                new[] { exception.Message })
        };

        var payload = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(payload);
    }
}

public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
