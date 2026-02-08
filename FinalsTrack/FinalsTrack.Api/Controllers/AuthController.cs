using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FinalsTrack.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IConfiguration _configuration;

        public AuthController(
            IUserService userService,
            IRoleService roleService,
            IUserRoleService userRoleService,
            IRefreshTokenService refreshTokenService,
            IConfiguration configuration)
        {
            _userService = userService;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _refreshTokenService = refreshTokenService;
            _configuration = configuration;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _userService.CreateAsync(
                dto.FullName,
                dto.Email,
                dto.Password
            );

            await _roleService.EnsureDefaultRolesAsync();

            var roleId = await _roleService.GetRoleIdByNameAsync("User");
            if (roleId.HasValue)
                await _userRoleService.AssignRoleAsync(user.Id, roleId.Value);

            return Ok("User registered successfully");
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            if (user.IsActive == false)
                return Unauthorized("Account is deactivated");

            var valid = await _userService.ValidatePasswordAsync(dto.Email, dto.Password);
            if (!valid)
                return Unauthorized("Invalid credentials");

            var accessToken = await GenerateJwtAsync(user.Id, user.Email);

            var refreshToken = Guid.NewGuid().ToString("N");
            var expires = DateTime.UtcNow.AddDays(7);

            await _refreshTokenService.CreateAsync(user.Id, refreshToken, expires);

            return Ok(new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }


        // ================= REFRESH =================
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshRequestDto dto)
        {
            var stored = await _refreshTokenService.ValidateAsync(dto.RefreshToken);
            if (stored == null)
                return Unauthorized("Invalid refresh token");

            var newAccessToken = await GenerateJwtAsync(
                stored.UserId,
                stored.User?.Email ?? ""
            );

            return Ok(new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = dto.RefreshToken
            });
        }

        // ================= LOGOUT / REVOKE =================
        [Authorize]
        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke(RevokeTokenDto dto)
        {
            await _refreshTokenService.RevokeAsync(dto.RefreshToken);
            return Ok("Refresh token revoked");
        }

        // ================= ME =================
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            int userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return Unauthorized();

            var roles = User.FindAll(ClaimTypes.Role)
                            .Select(r => r.Value);

            return Ok(new
            {
                userId = user.Id,
                email = user.Email,
                fullName = user.FullName,
                roles
            });
        }


        // ================= JWT HELPER (WITH ROLES) =================
        private async Task<string> GenerateJwtAsync(int userId, string email)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roles = await _userRoleService.GetUserRolesAsync(userId);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.AddRange(roles.Select(role =>
                new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(jwtSettings["ExpiresInMinutes"]!)
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
