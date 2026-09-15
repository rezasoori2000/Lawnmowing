using TurfOps.Domain.Common;

namespace TurfOps.Domain.Entities;

public class Equipment : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<MowRecord> MowRecords { get; set; } = new List<MowRecord>();
}
