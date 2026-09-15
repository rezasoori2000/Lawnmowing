using System.Net;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TurfOps.Application.Common;

namespace TurfOps.Api.Middleware;

/// <summary>
/// Catches unhandled exceptions and translates them into a consistent RFC 7807
/// ProblemDetails JSON response, so clients get a predictable error shape regardless
/// of which layer threw.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title, errors) = exception switch
        {
            NotFoundException => (HttpStatusCode.NotFound, "Resource not found", null),
            ValidationAppException vex => (HttpStatusCode.BadRequest, "Validation failed", (IDictionary<string, string[]>?)vex.Errors),
            FluentValidation.ValidationException fvex => (HttpStatusCode.BadRequest, "Validation failed",
                (IDictionary<string, string[]>?)fvex.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())),
            ConflictException => (HttpStatusCode.Conflict, "Conflict", null),
            UnauthorizedAppException => (HttpStatusCode.Unauthorized, "Unauthorized", null),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred", null)
        };

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);
        }
        else
        {
            _logger.LogWarning(exception, "Handled exception ({StatusCode}) processing {Method} {Path}", (int)statusCode, context.Request.Method, context.Request.Path);
        }

        var problemDetails = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = exception.Message,
            Instance = context.Request.Path,
            Type = $"https://httpstatuses.io/{(int)statusCode}"
        };

        if (errors is not null)
        {
            problemDetails.Extensions["errors"] = errors;
        }

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)statusCode;
        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}
