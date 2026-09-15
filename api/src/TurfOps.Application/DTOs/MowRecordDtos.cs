using TurfOps.Domain.Enums;

namespace TurfOps.Application.DTOs;

public class MowRecordDto
{
    public int Id { get; set; }
    public int LawnAreaId { get; set; }
    public string LawnAreaName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public MowHeight MowHeight { get; set; }
    public Direction Direction { get; set; }
    public int PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string? PhotoUrl { get; set; }
    public int CreatedByUserId { get; set; }
    public string CreatedByUserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateMowRecordRequest
{
    public int LawnAreaId { get; set; }
    public DateTime Date { get; set; }
    public MowHeight MowHeight { get; set; }
    public Direction Direction { get; set; }
    public int PersonId { get; set; }
    public int EquipmentId { get; set; }
    public string? Notes { get; set; }
}

public class UpdateMowRecordRequest
{
    public int LawnAreaId { get; set; }
    public DateTime Date { get; set; }
    public MowHeight MowHeight { get; set; }
    public Direction Direction { get; set; }
    public int PersonId { get; set; }
    public int EquipmentId { get; set; }
    public string? Notes { get; set; }
}

public class MowRecordQuery
{
    public int? LawnAreaId { get; set; }
    public int? PersonId { get; set; }
    public int? EquipmentId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public MowHeight? MowHeight { get; set; }
    public string? NotesSearch { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 25;
}
