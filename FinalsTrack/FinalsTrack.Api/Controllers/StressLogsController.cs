using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/stress-logs")]
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
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim);

        var created = await _service.CreateAsync(dto, userId);
        return Ok(created);
    }
}
