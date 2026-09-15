using Microsoft.EntityFrameworkCore;
using Serilog;
using TurfOps.Api.Extensions;
using TurfOps.Api.Middleware;
using TurfOps.Application;
using TurfOps.Infrastructure;
using TurfOps.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog structured logging ---
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});

// --- Services ---
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationActionFilter>();
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddTurfOpsAuthentication(builder.Configuration);
builder.Services.AddTurfOpsCors(builder.Configuration, builder.Environment);
builder.Services.AddTurfOpsSwagger();

var app = builder.Build();

// --- Middleware pipeline ---
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TurfOps API v1");
    });
}

app.UseHttpsRedirection();

app.UseCors(CorsServiceExtensions.PolicyName);

app.UseAuthentication();
app.UseAuthorization();

// Serve saved mow-record photos as static files under the configured public path prefix.
var photoRoot = Path.Combine(AppContext.BaseDirectory, "App_Data", "mow-photos");
Directory.CreateDirectory(photoRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(photoRoot),
    RequestPath = "/media/mow-photos"
});

app.MapControllers();

// --- Apply migrations automatically on startup in Development for a smooth local setup. ---
// Production deployments should run `dotnet ef database update` as an explicit release step instead.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<TurfOpsDbContext>();
    db.Database.Migrate();
}

app.Run();

// Exposed for WebApplicationFactory-based integration tests.
public partial class Program { }
