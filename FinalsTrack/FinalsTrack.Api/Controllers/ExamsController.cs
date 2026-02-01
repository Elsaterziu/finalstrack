using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinalsTrack.Api.Controllers;

[ApiController]
[Route("api/exams")]
public class ExamsController : ControllerBase
{
    private readonly IExamService _service;

    public ExamsController(IExamService service)
    {
        _service = service;
    }

    
    [Authorize(Roles = "Professor,Student")]
    [HttpGet("season/{examSeasonId:int}")]
    public async Task<IActionResult> GetBySeason(int examSeasonId)
    {
        return Ok(await _service.GetByExamSeasonAsync(examSeasonId));
    }

    
    [Authorize(Roles = "Professor,Student")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    
    [Authorize(Roles = "Professor")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateExamDto dto)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var created = await _service.CreateAsync(dto, userId);
        return Ok(created);
    }

    
    [Authorize(Roles = "Professor")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateExamDto dto)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var updated = await _service.UpdateAsync(id, dto, userId);
        if (updated == null) return NotFound();

        return Ok(updated);
    }

    
    [Authorize(Roles = "Professor")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
