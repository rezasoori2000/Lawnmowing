using TurfOps.Domain.Common;
using TurfOps.Domain.Enums;

namespace TurfOps.Domain.Entities;

public class MowRecord : AuditableEntity
{
    public int LawnAreaId { get; set; }
    public LawnArea? LawnArea { get; set; }

    public DateTime Date { get; set; }

    public MowHeight MowHeight { get; set; }
    public Direction Direction { get; set; }

    public int PersonId { get; set; }
    public Person? Person { get; set; }

    public int EquipmentId { get; set; }
    public Equipment? Equipment { get; set; }

    public string? Notes { get; set; }

    /// <summary>
    /// Relative path/URL to a photo saved under the configured local upload path.
    /// Phase 2: replace with blob storage URL - the field shape stays the same.
    /// </summary>
    public string? PhotoUrl { get; set; }

    public int CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
}
