using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Services;

public class PersonService : IPersonService
{
    private readonly IAppDbContext _db;

    public PersonService(IAppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<PersonDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default)
    {
        var query = _db.People.AsNoTracking();
        if (!includeInactive) query = query.Where(x => x.IsActive);

        return await query.OrderBy(x => x.Name).Select(x => ToDto(x)).ToListAsync(ct);
    }

    public async Task<PersonDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.People.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Person), id);
        return ToDto(entity);
    }

    public async Task<PersonDto> CreateAsync(CreatePersonRequest request, CancellationToken ct = default)
    {
        var entity = new Person { Name = request.Name.Trim(), IsActive = true, CreatedAt = DateTime.UtcNow };
        _db.People.Add(entity);
        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task<PersonDto> UpdateAsync(int id, UpdatePersonRequest request, CancellationToken ct = default)
    {
        var entity = await _db.People.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Person), id);

        entity.Name = request.Name.Trim();
        entity.IsActive = request.IsActive;
        await _db.SaveChangesAsync(ct);
        return ToDto(entity);
    }

    public async Task DeactivateAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.People.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(Person), id);
        entity.IsActive = false;
        await _db.SaveChangesAsync(ct);
    }

    private static PersonDto ToDto(Person x) => new()
    {
        Id = x.Id,
        Name = x.Name,
        IsActive = x.IsActive,
        CreatedAt = x.CreatedAt
    };
}
