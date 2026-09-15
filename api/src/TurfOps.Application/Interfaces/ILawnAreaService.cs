using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface ILawnAreaService
{
    Task<IReadOnlyList<LawnAreaDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
    Task<LawnAreaDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<LawnAreaDto> CreateAsync(CreateLawnAreaRequest request, CancellationToken ct = default);
    Task<LawnAreaDto> UpdateAsync(int id, UpdateLawnAreaRequest request, CancellationToken ct = default);
    Task DeactivateAsync(int id, CancellationToken ct = default);
}
