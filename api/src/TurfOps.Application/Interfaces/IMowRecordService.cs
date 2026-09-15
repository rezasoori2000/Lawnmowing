using TurfOps.Application.Common;
using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface IMowRecordService
{
    Task<PagedResult<MowRecordDto>> SearchAsync(MowRecordQuery query, CancellationToken ct = default);
    Task<MowRecordDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<MowRecordDto> CreateAsync(CreateMowRecordRequest request, int createdByUserId, CancellationToken ct = default);
    Task<MowRecordDto> UpdateAsync(int id, UpdateMowRecordRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
    Task<MowRecordDto> AttachPhotoAsync(int id, Stream content, string fileName, CancellationToken ct = default);
}
