using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IAppDbContext _db;

    public EquipmentService(IAppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<EquipmentDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default)
    {
        var query = _db.Equipment.AsNoTracking();
        if (!includeInactive) query = query.Where(x => x.IsActive);

        return await query.OrderBy(x => x.Name).Select(x => ToDto(x)).ToListAsync(ct);
    }

    public async Task<EquipmentDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.Equipment.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Equipment), id);
        return ToDto(entity);
    }

    public async Task<EquipmentDto> CreateAsync(CreateEquipmentRequest request, CancellationToken ct = default)
    {
        var entity = new Equipment { Name = request.Name.Trim(), IsActive = true, CreatedAt = DateTime.UtcNow };
        _db.Equipment.Add(entity);
        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task<EquipmentDto> UpdateAsync(int id, UpdateEquipmentRequest request, CancellationToken ct = default)
    {
        var entity = await _db.Equipment.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Equipment), id);

        entity.Name = request.Name.Trim();
        entity.IsActive = request.IsActive;
        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task DeactivateAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.Equipment.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Equipment), id);
        entity.IsActive = false;
        await _db.SaveChangesAsync(ct);
    }

    private static EquipmentDto ToDto(Equipment x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        IsActive = x.IsActive,
        CreatedAt = x.CreatedAt
    };
}
