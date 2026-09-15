namespace TurfOps.Domain.Enums;

/// <summary>
/// Mow height bands, in millimetres. Used both as a LawnArea default and per MowRecord.
/// </summary>
public enum MowHeight
{
    Mm15To20 = 0,
    Mm20To25 = 1,
    Mm25To30 = 2,
    Mm30To35 = 3,
    Mm35To40 = 4,
    Mm40To45 = 5,
    Mm45To50 = 6,
    Mm50To55 = 7,
    Mm55To60 = 8,
    Mm60To65 = 9,
    Mm65Plus = 10
}
