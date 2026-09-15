using Microsoft.EntityFrameworkCore;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IAppDbContext _db;
    private readonly IDueStatusCalculator _calculator;

    public DashboardService(IAppDbContext db, IDueStatusCalculator calculator)
    {
        _db = db;
        _calculator = calculator;
    }

    public async Task<DashboardResponse> GetDashboardAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        var lawnAreas = await _db.LawnAreas.AsNoTracking().Where(x => x.IsActive).ToListAsync(ct);

        // Last mow date per lawn area, computed in one grouped query rather than N+1.
        var lastMowDates = await _db.MowRecords.AsNoTracking()
            .GroupBy(x => x.LawnAreaId)
            .Select(g => new { LawnAreaId = g.Key, LastDate = g.Max(x => x.Date) })
            .ToDictionaryAsync(x => x.LawnAreaId, x => x.LastDate, ct);

        var response = new DashboardResponse();

        foreach (var area in lawnAreas)
        {
            lastMowDates.TryGetValue(area.Id, out var lastDate);
            DateTime? lastMowed = lastMowDates.ContainsKey(area.Id) ? lastDate : null;

            var status = _calculator.Calculate(area, lastMowed, now);

            var dto = new LawnAreaStatusDto
            {
                LawnAreaId = area.Id,
                LawnAreaName = area.Name,
                LastMowedDate = status.LastMowedDate,
                DueDate = status.DueDate,
                DaysOverdue = status.DaysOverdue,
                DaysUntilDue = status.DaysUntilDue
            };

            switch (status.Bucket)
            {
                case DueBucket.Overdue:
                case DueBucket.NoHistory:
                    response.Overdue.Add(dto);
                    break;
                case DueBucket.DueToday:
                    response.DueToday.Add(dto);
                    break;
                case DueBucket.DueThisWeek:
                    response.DueThisWeek.Add(dto);
                    break;
            }
        }

        response.Overdue = response.Overdue.OrderByDescending(x => x.DaysOverdue ?? int.MaxValue).ToList();
        response.DueThisWeek = response.DueThisWeek.OrderBy(x => x.DaysUntilDue).ToList();

        response.RecentlyMowed = await _db.MowRecords.AsNoTracking()
            .Include(x => x.LawnArea)
            .Include(x => x.Person)
            .Include(x => x.Equipment)
            .Include(x => x.CreatedByUser)
            .OrderByDescending(x => x.Date).ThenByDescending(x => x.Id)
            .Take(10)
            .Select(x => new MowRecordDto
            {
                Id = x.Id,
                LawnAreaId = x.LawnAreaId,
                LawnAreaName = x.LawnArea != null ? x.LawnArea.Name : string.Empty,
                Date = x.Date,
                MowHeight = x.MowHeight,
                Direction = x.Direction,
                PersonId = x.PersonId,
                PersonName = x.Person != null ? x.Person.Name : string.Empty,
                EquipmentId = x.EquipmentId,
                EquipmentName = x.Equipment != null ? x.Equipment.Name : string.Empty,
                Notes = x.Notes,
                PhotoUrl = x.PhotoUrl,
                CreatedByUserId = x.CreatedByUserId,
                CreatedByUserName = x.CreatedByUser != null ? x.CreatedByUser.DisplayName : string.Empty,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(ct);

        return response;
    }
}
