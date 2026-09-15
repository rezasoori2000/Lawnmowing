using Microsoft.EntityFrameworkCore;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;

namespace TurfOps.Application.Services;

public class ReportService : IReportService
{
    private readonly IAppDbContext _db;

    public ReportService(IAppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<MowsByLawnAreaDto>> MowsPerLawnAreaAsync(ReportQuery query, CancellationToken ct = default)
    {
        var q = ApplyDateRange(_db.MowRecords.AsNoTracking(), query);

        return await q
            .GroupBy(x => new { x.LawnAreaId, x.LawnArea!.Name })
            .Select(g => new MowsByLawnAreaDto
            {
                LawnAreaId = g.Key.LawnAreaId,
                LawnAreaName = g.Key.Name,
                MowCount = g.Count()
            })
            .OrderByDescending(x => x.MowCount)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<MowsByPersonDto>> MowsPerPersonAsync(ReportQuery query, CancellationToken ct = default)
    {
        var q = ApplyDateRange(_db.MowRecords.AsNoTracking(), query);

        return await q
            .GroupBy(x => new { x.PersonId, x.Person!.Name })
            .Select(g => new MowsByPersonDto
            {
                PersonId = g.Key.PersonId,
                PersonName = g.Key.Name,
                MowCount = g.Count()
            })
            .OrderByDescending(x => x.MowCount)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<MowsByEquipmentDto>> MowsPerEquipmentAsync(ReportQuery query, CancellationToken ct = default)
    {
        var q = ApplyDateRange(_db.MowRecords.AsNoTracking(), query);

        return await q
            .GroupBy(x => new { x.EquipmentId, x.Equipment!.Name })
            .Select(g => new MowsByEquipmentDto
            {
                EquipmentId = g.Key.EquipmentId,
                EquipmentName = g.Key.Name,
                MowCount = g.Count()
            })
            .OrderByDescending(x => x.MowCount)
            .ToListAsync(ct);
    }

    private static IQueryable<Domain.Entities.MowRecord> ApplyDateRange(IQueryable<Domain.Entities.MowRecord> q, ReportQuery query)
    {
        if (query.DateFrom.HasValue) q = q.Where(x => x.Date >= query.DateFrom.Value.Date);
        if (query.DateTo.HasValue) q = q.Where(x => x.Date <= query.DateTo.Value.Date);
        return q.Include(x => x.LawnArea).Include(x => x.Person).Include(x => x.Equipment);
    }
}
