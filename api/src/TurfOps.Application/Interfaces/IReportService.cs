using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface IReportService
{
    Task<IReadOnlyList<MowsByLawnAreaDto>> MowsPerLawnAreaAsync(ReportQuery query, CancellationToken ct = default);
    Task<IReadOnlyList<MowsByPersonDto>> MowsPerPersonAsync(ReportQuery query, CancellationToken ct = default);
    Task<IReadOnlyList<MowsByEquipmentDto>> MowsPerEquipmentAsync(ReportQuery query, CancellationToken ct = default);
}
