using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinalsTrack.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/subjects")]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _service;

    public SubjectsController(ISubjectService service)
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
    public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim);

        var created = await _service.CreateAsync(dto, userId);
        return Ok(created);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
