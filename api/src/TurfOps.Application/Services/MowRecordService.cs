using Microsoft.EntityFrameworkCore;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Services;

public class MowRecordService : IMowRecordService
{
    private readonly IAppDbContext _db;
    private readonly IPhotoStorageService _photoStorage;

    public MowRecordService(IAppDbContext db, IPhotoStorageService photoStorage)
    {
        _db = db;
        _photoStorage = photoStorage;
    }

    public async Task<PagedResult<MowRecordDto>> SearchAsync(MowRecordQuery query, CancellationToken ct = default)
    {
        var q = BaseQuery();

        if (query.LawnAreaId.HasValue) q = q.Where(x => x.LawnAreaId == query.LawnAreaId);
        if (query.PersonId.HasValue) q = q.Where(x => x.PersonId == query.PersonId);
        if (query.EquipmentId.HasValue) q = q.Where(x => x.EquipmentId == query.EquipmentId);
        if (query.DateFrom.HasValue) q = q.Where(x => x.Date >= query.DateFrom.Value.Date);
        if (query.DateTo.HasValue) q = q.Where(x => x.Date <= query.DateTo.Value.Date);
        if (query.MowHeight.HasValue) q = q.Where(x => x.MowHeight == query.MowHeight);
        if (!string.IsNullOrWhiteSpace(query.NotesSearch))
        {
            var term = query.NotesSearch.Trim();
            q = q.Where(x => x.Notes != null && EF.Functions.Like(x.Notes, $"%{term}%"));
        }

        var totalCount = await q.CountAsync(ct);

        var page = Math.Max(1, query.Page);
        var pageSize = query.PageSize is > 0 and <= 200 ? query.PageSize : 25;

        var items = await q
            .OrderByDescending(x => x.Date).ThenByDescending(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => ToDto(x))
            .ToListAsync(ct);

        return new PagedResult<MowRecordDto> { Items = items, TotalCount = totalCount, Page = page, PageSize = pageSize };
    }

    public async Task<MowRecordDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var dto = await BaseQuery().Where(x => x.Id == id).Select(x => ToDto(x)).FirstOrDefaultAsync(ct)
            ?? throw new NotFoundException(nameof(MowRecord), id);
        return dto;
    }

    public async Task<MowRecordDto> CreateAsync(CreateMowRecordRequest request, int createdByUserId, CancellationToken ct = default)
    {
        await EnsureReferencesExistAsync(request.LawnAreaId, request.PersonId, request.EquipmentId, ct);

        var entity = new MowRecord
        {
            LawnAreaId = request.LawnAreaId,
            Date = request.Date.Date,
            MowHeight = request.MowHeight,
            Direction = request.Direction,
            PersonId = request.PersonId,
            EquipmentId = request.EquipmentId,
            Notes = request.Notes,
            CreatedByUserId = createdByUserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.MowRecords.Add(entity);
        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(entity.Id, ct);
    }

    public async Task<MowRecordDto> UpdateAsync(int id, UpdateMowRecordRequest request, CancellationToken ct = default)
    {
        var entity = await _db.MowRecords.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(MowRecord), id);

        await EnsureReferencesExistAsync(request.LawnAreaId, request.PersonId, request.EquipmentId, ct);

        entity.LawnAreaId = request.LawnAreaId;
        entity.Date = request.Date.Date;
        entity.MowHeight = request.MowHeight;
        entity.Direction = request.Direction;
        entity.PersonId = request.PersonId;
        entity.EquipmentId = request.EquipmentId;
        entity.Notes = request.Notes;

        await _db.SaveChangesAsync(ct);
        return await GetByIdAsync(entity.Id, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var entity = await _db.MowRecords.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(MowRecord), id);

        _db.MowRecords.Remove(entity);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<MowRecordDto> AttachPhotoAsync(int id, Stream content, string fileName, CancellationToken ct = default)
    {
        var entity = await _db.MowRecords.FirstOrDefaultAsync(x => x.Id == id, ct)
            ?? throw new NotFoundException(nameof(MowRecord), id);

        var url = await _photoStorage.SaveAsync(id, content, fileName, ct);
        entity.PhotoUrl = url;
        await _db.SaveChangesAsync(ct);

        return await GetByIdAsync(entity.Id, ct);
    }

    private async Task EnsureReferencesExistAsync(int lawnAreaId, int personId, int equipmentId, CancellationToken ct)
    {
        if (!await _db.LawnAreas.AnyAsync(x => x.Id == lawnAreaId, ct))
            throw new NotFoundException(nameof(LawnArea), lawnAreaId);
        if (!await _db.People.AnyAsync(x => x.Id == personId, ct))
            throw new NotFoundException(nameof(Person), personId);
        if (!await _db.Equipment.AnyAsync(x => x.Id == equipmentId, ct))
            throw new NotFoundException(nameof(Equipment), equipmentId);
    }

    private IQueryable<MowRecord> BaseQuery() =>
        _db.MowRecords.AsNoTracking()
            .Include(x => x.LawnArea)
            .Include(x => x.Person)
            .Include(x => x.Equipment)
            .Include(x => x.CreatedByUser);

    private static MowRecordDto ToDto(MowRecord x) => new()
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
    };
}
