using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(CancellationToken ct = default);
}
