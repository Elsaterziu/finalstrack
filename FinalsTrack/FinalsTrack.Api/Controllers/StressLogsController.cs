using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinalsTrack.Api.Controllers;

[ApiController]
[Route("api/stress-logs")]
[Authorize(Roles = "Student")]
public class StressLogsController : ControllerBase
{
    private readonly IStressLogService _service;

    public StressLogsController(IStressLogService service)
    {
        _service = service;
    }

    [HttpGet("exam/{examId:int}")]
    public async Task<IActionResult> GetByExam(int examId)
    {
        return Ok(await _service.GetByExamAsync(examId));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStressLogDto dto)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var created = await _service.CreateAsync(dto, userId);
        return Ok(created);
    }
}
