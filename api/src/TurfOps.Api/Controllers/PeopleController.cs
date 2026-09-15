using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;

namespace TurfOps.Api.Controllers;

[ApiController]
[Route("api/v1/people")]
[Authorize]
public class PeopleController : ControllerBase
{
    private readonly IPersonService _service;

    public PeopleController(IPersonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PersonDto>>> GetAll([FromQuery] bool includeInactive = false, CancellationToken ct = default)
    {
        return Ok(await _service.GetAllAsync(includeInactive, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PersonDto>> GetById(int id, CancellationToken ct)
    {
        return Ok(await _service.GetByIdAsync(id, ct));
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<PersonDto>> Create(CreatePersonRequest request, CancellationToken ct)
    {
        var result = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<PersonDto>> Update(int id, UpdatePersonRequest request, CancellationToken ct)
    {
        return Ok(await _service.UpdateAsync(id, request, ct));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Deactivate(int id, CancellationToken ct)
    {
        await _service.DeactivateAsync(id, ct);
        return NoContent();
    }
}
