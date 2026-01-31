using Microsoft.AspNetCore.Mvc;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FinalsTrack.Api.Controllers;

[ApiController]
[Route("api/exam-seasons")]
[Authorize]
public class ExamSeasonsController : ControllerBase
{
    private readonly IExamSeasonService _service;

    public ExamSeasonsController(IExamSeasonService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExamSeasonDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("Invalid or missing token");

        int userId = int.Parse(userIdClaim);

        var created = await _service.CreateAsync(dto, userId);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}

