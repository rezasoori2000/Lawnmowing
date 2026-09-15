namespace TurfOps.Application.DTOs;

public class EquipmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateEquipmentRequest
{
    public string Name { get; set; } = string.Empty;
}

public class UpdateEquipmentRequest
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
