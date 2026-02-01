using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinalsTrack.Api.Controllers
{
    [ApiController]
    [Route("api/roles")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;

        public RolesController(IRoleService roleService, IUserRoleService userRoleService)
        {
            _roleService = roleService;
            _userRoleService = userRoleService;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> Assign(AssignRoleDto dto)
        {
            var roleId = await _roleService.GetRoleIdByNameAsync(dto.RoleName);
            if (!roleId.HasValue) return NotFound("Role not found");

            await _userRoleService.AssignRoleAsync(dto.UserId, roleId.Value);
            return Ok("Role assigned");
        }

        [HttpPost("remove")]
        public async Task<IActionResult> Remove(RemoveRoleDto dto)
        {
            var roleId = await _roleService.GetRoleIdByNameAsync(dto.RoleName);
            if (!roleId.HasValue) return NotFound("Role not found");

            await _userRoleService.RemoveRoleAsync(dto.UserId, roleId.Value);
            return Ok("Role removed");
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetUserRoles(int userId)
        {
            var roles = await _userRoleService.GetUserRolesAsync(userId);
            return Ok(roles);
        }
    }
}
