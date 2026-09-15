using Microsoft.OpenApi.Models;

namespace TurfOps.Api.Extensions;

public static class SwaggerServiceExtensions
{
    public static IServiceCollection AddTurfOpsSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "TurfOps API",
                Version = "v1",
                Description = "Turf/lawn maintenance management API for the TurfOps operation. " +
                              "Use POST /api/v1/auth/login to obtain a JWT, then click Authorize below."
            });

            var securityScheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter: Bearer {your JWT access token}",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            };

            options.AddSecurityDefinition("Bearer", securityScheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                { securityScheme, Array.Empty<string>() }
            });
        });

        return services;
    }
}
