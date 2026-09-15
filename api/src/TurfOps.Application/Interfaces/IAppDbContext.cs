using Microsoft.EntityFrameworkCore;
using TurfOps.Domain.Entities;

namespace TurfOps.Application.Interfaces;

/// <summary>
/// Abstraction over the EF Core DbContext so Application-layer services depend only on
/// this interface, not on Infrastructure/EF Core directly. Kept intentionally thin
/// (DbSet + SaveChanges) - this is a pragmatic choice for an app this size rather than
/// a full repository-per-aggregate pattern.
/// </summary>
public interface IAppDbContext
{
    DbSet<LawnArea> LawnAreas { get; }
    DbSet<Person> People { get; }
    DbSet<Equipment> Equipment { get; }
    DbSet<MowRecord> MowRecords { get; }
    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
