using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;

namespace TurfOps.Api.Controllers;

[ApiController]
[Route("api/v1/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _service;

    public ReportsController(IReportService service)
    {
        _service = service;
    }

    [HttpGet("mows-per-lawn-area")]
    public async Task<ActionResult<IReadOnlyList<MowsByLawnAreaDto>>> MowsPerLawnArea(
        [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, CancellationToken ct)
    {
        return Ok(await _service.MowsPerLawnAreaAsync(new ReportQuery { DateFrom = dateFrom, DateTo = dateTo }, ct));
    }

    [HttpGet("mows-per-person")]
    public async Task<ActionResult<IReadOnlyList<MowsByPersonDto>>> MowsPerPerson(
        [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, CancellationToken ct)
    {
        return Ok(await _service.MowsPerPersonAsync(new ReportQuery { DateFrom = dateFrom, DateTo = dateTo }, ct));
    }

    [HttpGet("mows-per-equipment")]
    public async Task<ActionResult<IReadOnlyList<MowsByEquipmentDto>>> MowsPerEquipment(
        [FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo, CancellationToken ct)
    {
        return Ok(await _service.MowsPerEquipmentAsync(new ReportQuery { DateFrom = dateFrom, DateTo = dateTo }, ct));
    }
}
