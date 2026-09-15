using TurfOps.Application.Interfaces;
using TurfOps.Domain.Entities;
using TurfOps.Domain.Enums;

namespace TurfOps.Application.Services;

public class DueStatusCalculator : IDueStatusCalculator
{
    /// <summary>
    /// Maps a frequency band to a concrete day count used for the due-date calculation.
    /// Bands use their upper bound (the more conservative/eager-to-flag value) except
    /// Custom, which uses LawnArea.CustomFrequencyDays.
    /// </summary>
    public int GetFrequencyDays(LawnArea lawnArea)
    {
        return lawnArea.DefaultFrequency switch
        {
            MowFrequency.Days7To10 => 10,
            MowFrequency.Days10To14 => 14,
            MowFrequency.Days14To21 => 21,
            MowFrequency.Days21To25 => 25,
            MowFrequency.Custom => lawnArea.CustomFrequencyDays ?? 14,
            _ => 14
        };
    }

    public DueStatus Calculate(LawnArea lawnArea, DateTime? lastMowedDate, DateTime asOf)
    {
        var today = asOf.Date;

        if (lastMowedDate is null)
        {
            // Never mowed: treat as overdue as of today so it surfaces for attention,
            // but with no meaningful "days overdue" baseline.
            return new DueStatus(DueBucket.NoHistory, null, null, null, null);
        }

        var frequencyDays = GetFrequencyDays(lawnArea);
        var dueDate = lastMowedDate.Value.Date.AddDays(frequencyDays);
        var diffDays = (dueDate - today).Days;

        if (diffDays < 0)
        {
            return new DueStatus(DueBucket.Overdue, lastMowedDate, dueDate, Math.Abs(diffDays), null);
        }

        if (diffDays == 0)
        {
            return new DueStatus(DueBucket.DueToday, lastMowedDate, dueDate, null, 0);
        }

        if (diffDays <= 7)
        {
            return new DueStatus(DueBucket.DueThisWeek, lastMowedDate, dueDate, null, diffDays);
        }

        return new DueStatus(DueBucket.UpToDate, lastMowedDate, dueDate, null, diffDays);
    }
}
