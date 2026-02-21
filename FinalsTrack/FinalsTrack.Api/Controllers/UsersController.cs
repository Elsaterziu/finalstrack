using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinalsTrack.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRoleService _userRoleService;

        public UsersController(IUserService userService, IUserRoleService userRoleService)
        {
            _userService = userService;
            _userRoleService = userRoleService;
        }

        private int CurrentUserId()
            => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ===================== ME =====================
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = CurrentUserId();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userRoleService.GetUserRolesAsync(userId);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = roles,
                IsActive = user.IsActive
            });
        }

        // ===================== UPDATE ME =====================
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(UpdateMeDto dto)
        {
            var userId = CurrentUserId();

            var ok = await _userService.UpdateMeAsync(userId, dto.FullName);
            if (!ok) return NotFound();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userRoleService.GetUserRolesAsync(userId);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = roles,
                IsActive = user.IsActive
            });
        }


        // ===================== CHANGE PASSWORD =====================
        [Authorize]
        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = CurrentUserId();

            var ok = await _userService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            if (!ok) return BadRequest("Current password is incorrect");

            return Ok("Password changed");
        }

        // ===================== PROFESSOR: COUNT STUDENTS =====================
        [Authorize(Roles = "Professor")]
        [HttpGet("count/students")]
        public async Task<IActionResult> GetStudentsCount()
        {
            var count = await _userService.GetUsersCountByRoleAsync("Student");
            return Ok(count);
        }

        // ===================== ADMIN: GET ALL USERS =====================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();

            var result = new List<UserResponseDto>();
            foreach (var u in users)
            {
                var roles = await _userRoleService.GetUserRolesAsync(u.Id);
                result.Add(new UserResponseDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    Roles = roles,
                    IsActive = u.IsActive
                });
            }

            return Ok(result);
        }

        // ===================== ADMIN: GET USER BY ID =====================
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();

            var roles = await _userRoleService.GetUserRolesAsync(user.Id);

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = roles,
                IsActive = user.IsActive
            });

        }

        // ===================== ADMIN: DELETE USER =====================
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _userService.DeleteAsync(id);
            if (!ok) return NotFound();

            return Ok("User deleted");
        }
        //=============
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> SetStatus(int id, [FromQuery] bool active)
        {
            var currentAdminId = CurrentUserId();
            if (id == currentAdminId && active == false)
                return BadRequest("Admin cannot deactivate yourself.");

            var ok = await _userService.SetActiveStatusAsync(id, active);
            if (!ok) return NotFound();

            return Ok(active ? "User activated" : "User deactivated");
        }

    }
}
