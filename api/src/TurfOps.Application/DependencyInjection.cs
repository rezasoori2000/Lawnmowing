using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TurfOps.Application.Interfaces;
using TurfOps.Application.Services;

namespace TurfOps.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<IDueStatusCalculator, DueStatusCalculator>();
        services.AddScoped<ILawnAreaService, LawnAreaService>();
        services.AddScoped<IPersonService, PersonService>();
        services.AddScoped<IEquipmentService, EquipmentService>();
        services.AddScoped<IMowRecordService, MowRecordService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
