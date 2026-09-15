namespace TurfOps.Domain.Enums;

/// <summary>
/// Standard recurring-mow frequency bands. Custom allows an arbitrary day count
/// via LawnArea.CustomFrequencyDays.
/// </summary>
public enum MowFrequency
{
    Days7To10 = 0,
    Days10To14 = 1,
    Days14To21 = 2,
    Days21To25 = 3,
    Custom = 4
}
