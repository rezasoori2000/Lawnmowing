using TurfOps.Domain.Entities;

namespace TurfOps.Application.Interfaces;

public enum DueBucket
{
    NoHistory,
    UpToDate,
    DueThisWeek,
    DueToday,
    Overdue
}

public record DueStatus(DueBucket Bucket, DateTime? LastMowedDate, DateTime? DueDate, int? DaysOverdue, int? DaysUntilDue);

/// <summary>
/// Pure calculation of a lawn area's due/overdue status from its frequency window and
/// last mow date. No persistence - the "as of" date is passed in for testability.
/// </summary>
public interface IDueStatusCalculator
{
    int GetFrequencyDays(LawnArea lawnArea);
    DueStatus Calculate(LawnArea lawnArea, DateTime? lastMowedDate, DateTime asOf);
}
