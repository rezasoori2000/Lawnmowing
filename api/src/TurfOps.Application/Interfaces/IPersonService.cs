using TurfOps.Application.DTOs;

namespace TurfOps.Application.Interfaces;

public interface IPersonService
{
    Task<IReadOnlyList<PersonDto>> GetAllAsync(bool includeInactive, CancellationToken ct = default);
    Task<PersonDto> GetByIdAsync(int id, CancellationToken ct = default);
    Task<PersonDto> CreateAsync(CreatePersonRequest request, CancellationToken ct = default);
    Task<PersonDto> UpdateAsync(int id, UpdatePersonRequest request, CancellationToken ct = default);
    Task DeactivateAsync(int id, CancellationToken ct = default);
}
