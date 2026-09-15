namespace TurfOps.Application.DTOs;

public class ReportQuery
{
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}

public class MowsByLawnAreaDto
{
    public int LawnAreaId { get; set; }
    public string LawnAreaName { get; set; } = string.Empty;
    public int MowCount { get; set; }
}

public class MowsByPersonDto
{
    public int PersonId { get; set; }
    public string PersonName { get; set; } = string.Empty;
    public int MowCount { get; set; }
}

public class MowsByEquipmentDto
{
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = string.Empty;
    public int MowCount { get; set; }
}
