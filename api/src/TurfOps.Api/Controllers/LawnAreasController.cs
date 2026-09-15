using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;

namespace TurfOps.Api.Controllers;

[ApiController]
[Route("api/v1/lawn-areas")]
[Authorize]
public class LawnAreasController : ControllerBase
{
    private readonly ILawnAreaService _service;

    public LawnAreasController(ILawnAreaService service)
    {
        _service = service;
    }

    /// <summary>Lists lawn areas. All authenticated staff can view.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<LawnAreaDto>>> GetAll([FromQuery] bool includeInactive = false, CancellationToken ct = default)
    {
        return Ok(await _service.GetAllAsync(includeInactive, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LawnAreaDto>> GetById(int id, CancellationToken ct)
    {
        return Ok(await _service.GetByIdAsync(id, ct));
    }

    /// <summary>Admin only: create a lawn area.</summary>
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<LawnAreaDto>> Create(CreateLawnAreaRequest request, CancellationToken ct)
    {
        var result = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>Admin only: update a lawn area.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<LawnAreaDto>> Update(int id, UpdateLawnAreaRequest request, CancellationToken ct)
    {
        return Ok(await _service.UpdateAsync(id, request, ct));
    }

    /// <summary>Admin only: soft-delete (deactivate) a lawn area.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Deactivate(int id, CancellationToken ct)
    {
        await _service.DeactivateAsync(id, ct);
        return NoContent();
    }
}
