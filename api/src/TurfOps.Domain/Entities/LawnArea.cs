using TurfOps.Domain.Common;
using TurfOps.Domain.Enums;

namespace TurfOps.Domain.Entities;

public class LawnArea : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public MowHeight DefaultMowHeight { get; set; }
    public MowFrequency DefaultFrequency { get; set; }

    /// <summary>Only used when DefaultFrequency == MowFrequency.Custom.</summary>
    public int? CustomFrequencyDays { get; set; }

    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<MowRecord> MowRecords { get; set; } = new List<MowRecord>();
}
