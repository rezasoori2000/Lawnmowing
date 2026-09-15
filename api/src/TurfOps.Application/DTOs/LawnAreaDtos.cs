using TurfOps.Domain.Enums;

namespace TurfOps.Application.DTOs;

public class LawnAreaDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public MowHeight DefaultMowHeight { get; set; }
    public MowFrequency DefaultFrequency { get; set; }
    public int? CustomFrequencyDays { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLawnAreaRequest
{
    public string Name { get; set; } = string.Empty;
    public MowHeight DefaultMowHeight { get; set; }
    public MowFrequency DefaultFrequency { get; set; }
    public int? CustomFrequencyDays { get; set; }
    public string? Notes { get; set; }
}

public class UpdateLawnAreaRequest
{
    public string Name { get; set; } = string.Empty;
    public MowHeight DefaultMowHeight { get; set; }
    public MowFrequency DefaultFrequency { get; set; }
    public int? CustomFrequencyDays { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}
