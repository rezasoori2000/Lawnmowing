using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Services;

public class LawnAreaService : ILawnAreaService
{
    private readonly IAppDbContext _db;

    public LawnAreaService(IAppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<LawnAreaDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default)
    {
        var query = _db.LawnAreas.AsNoTracking();
        if (!includeInactive) query = query.Where(x => x.IsActive);

        return await query
            .OrderBy(x => x.Name)
            .Select(x => ToDto(x))
            .ToListAsync(ct);
    }

    public async Task<LawnAreaDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.LawnAreas.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(LawnArea), id);
        return ToDto(entity);
    }

    public async Task<LawnAreaDto> CreateAsync(CreateLawnAreaRequest request, CancellationToken ct = default)
    {
        var entity = new LawnArea
        {
            Name = request.Name.Trim(),
            DefaultMowHeight = request.DefaultMowHeight,
            DefaultFrequency = request.DefaultFrequency,
            CustomFrequencyDays = request.CustomFrequencyDays,
            Notes = request.Notes,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.LawnAreas.Add(entity);
        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task<LawnAreaDto> UpdateAsync(int id, UpdateLawnAreaRequest request, CancellationToken ct = default)
    {
        var entity = await _db.LawnAreas.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(LawnArea), id);

        entity.Name = request.Name.Trim();
        entity.DefaultMowHeight = request.DefaultMowHeight;
        entity.DefaultFrequency = request.DefaultFrequency;
        entity.CustomFrequencyDays = request.CustomFrequencyDays;
        entity.Notes = request.Notes;
        entity.IsActive = request.IsActive;

        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task DeactivateAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.LawnAreas.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(LawnArea), id);

        entity.IsActive = false;
        await _db.SaveChangesAsync(ct);
    }

    private static LawnAreaDto ToDto(LawnArea x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        DefaultMowHeight = x.DefaultMowHeight,
        DefaultFrequency = x.DefaultFrequency,
        CustomFrequencyDays = x.CustomFrequencyDays,
        Notes = x.Notes,
        IsActive = x.IsActive,
        CreatedAt = x.CreatedAt
    };
}
