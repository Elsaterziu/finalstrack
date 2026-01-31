using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinalsTrack.Api.Controllers;

[ApiController]
[Route("api/study-blocks")]
[Authorize]
public class StudyBlocksController : ControllerBase
{
    private readonly IStudyBlockService _service;

    public StudyBlocksController(IStudyBlockService service)
    {
        _service = service;
    }

    [HttpGet("exam/{examId:int}")]
    public async Task<IActionResult> GetByExam(int examId)
    {
        return Ok(await _service.GetByExamAsync(examId));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateStudyBlockDto dto)
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
