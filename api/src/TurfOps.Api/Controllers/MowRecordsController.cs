using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TurfOps.Api.Extensions;
using TurfOps.Application.Common;
using TurfOps.Application.DTOs;
using TurfOps.Application.Interfaces;
using TurfOps.Domain.Enums;

namespace TurfOps.Api.Controllers;

[ApiController]
[Route("api/v1/mow-records")]
[Authorize]
public class MowRecordsController : ControllerBase
{
    private readonly IMowRecordService _service;
    private const long MaxPhotoBytes = 10 * 1024 * 1024;
    private static readonly HashSet<string> AllowedPhotoExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".heic", ".webp"
    };

    public MowRecordsController(IMowRecordService service)
    {
        _service = service;
    }

    /// <summary>Search/list mow records with optional filters and paging.</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<MowRecordDto>>> Search(
        [FromQuery] int? lawnAreaId,
        [FromQuery] int? personId,
        [FromQuery] int? equipmentId,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] MowHeight? mowHeight,
        [FromQuery] string? notes,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        CancellationToken ct = default)
    {
        var query = new MowRecordQuery
        {
            LawnAreaId = lawnAreaId,
            PersonId = personId,
            EquipmentId = equipmentId,
            DateFrom = dateFrom,
            DateTo = dateTo,
            MowHeight = mowHeight,
            NotesSearch = notes,
            Page = page,
            PageSize = pageSize
        };

        return Ok(await _service.SearchAsync(query, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MowRecordDto>> GetById(int id, CancellationToken ct)
    {
        return Ok(await _service.GetByIdAsync(id, ct));
    }

    /// <summary>Any authenticated staff member can log a mow.</summary>
    [HttpPost]
    public async Task<ActionResult<MowRecordDto>> Create(CreateMowRecordRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        var result = await _service.CreateAsync(request, userId, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MowRecordDto>> Update(int id, UpdateMowRecordRequest request, CancellationToken ct)
    {
        return Ok(await _service.UpdateAsync(id, request, ct));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }

    /// <summary>Uploads a photo (multipart/form-data, field name "file") for an existing mow record.</summary>
    [HttpPost("{id:int}/photo")]
    [RequestSizeLimit(MaxPhotoBytes)]
    public async Task<ActionResult<MowRecordDto>> UploadPhoto(int id, IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "A non-empty file is required." });

        if (file.Length > MaxPhotoBytes)
            return BadRequest(new { message = "File exceeds the 10MB upload limit." });

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedPhotoExtensions.Contains(extension))
            return BadRequest(new { message = "Unsupported file type. Allowed: jpg, jpeg, png, heic, webp." });

        await using var stream = file.OpenReadStream();
        var result = await _service.AttachPhotoAsync(id, stream, file.FileName, ct);
        return Ok(result);
    }
}
