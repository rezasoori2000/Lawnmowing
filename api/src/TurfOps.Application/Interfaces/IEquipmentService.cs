using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface IEquipmentService
{
    Task<IReadOnlyList<EquipmentDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
    Task<EquipmentDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<EquipmentDto> CreateAsync(CreateEquipmentRequest request, CancellationToken ct = default);
    Task<EquipmentDto> UpdateAsync(int id, UpdateEquipmentRequest request, CancellationToken ct = default);
    Task DeactivateAsync(int id, CancellationToken ct = default);
}
