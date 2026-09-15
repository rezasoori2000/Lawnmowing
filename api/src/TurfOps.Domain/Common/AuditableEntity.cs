namespace TurfOps.Domain.Common;

/// <summary>
/// Base class for entities that track creation/active state.
/// Extension point: add UpdatedAt/UpdatedBy here later without touching every entity.
/// </summary>
public abstract class AuditableEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
