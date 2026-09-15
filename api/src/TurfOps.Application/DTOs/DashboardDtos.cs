namespace TurfOps.Application.DTOs;

public class LawnAreaStatusDto
{
    public int LawnAreaId { get; set; }
    public string LawnAreaName { get; set; } = string.Empty;
    public DateTime? LastMowedDate { get; set; }
    public DateTime? DueDate { get; set; }
    public int? DaysOverdue { get; set; }
    public int? DaysUntilDue { get; set; }
}

public class DashboardResponse
{
    public List<LawnAreaStatusDto> Overdue { get; set; } = new();
    public List<LawnAreaStatusDto> DueToday { get; set; } = new();
    public List<LawnAreaStatusDto> DueThisWeek { get; set; } = new();
    public List<MowRecordDto> RecentlyMowed { get; set; } = new();
}
