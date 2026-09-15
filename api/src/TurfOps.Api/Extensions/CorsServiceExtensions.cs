namespace TurfOps.Api.Extensions;

public static class CorsServiceExtensions
{
    public const string PolicyName = "TurfOpsCorsPolicy";

    public static IServiceCollection AddTurfOpsCors(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment env)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                if (env.IsDevelopment())
                {
                    // Permissive for the mobile app's Metro/Expo dev server and simulators,
                    // where the origin/port varies by device (localhost, 10.0.2.2, LAN IP, etc).
                    policy.SetIsOriginAllowed(_ => true)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                }
                else
                {
                    var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                }
            });
        });

        return services;
    }
}
