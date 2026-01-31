using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinalsTrack.Api.Controllers;

[ApiController]
[Route("api/exams")]
[Authorize]
public class ExamsController : ControllerBase
{
    private readonly IExamService _service;

    public ExamsController(IExamService service)
    {
        _service = service;
    }

    [HttpGet("season/{examSeasonId:int}")]
    public async Task<IActionResult> GetBySeason(int examSeasonId)
    {
        return Ok(await _service.GetByExamSeasonAsync(examSeasonId));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateExamDto dto)
    {
        return Ok(await _service.CreateAsync(dto));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
