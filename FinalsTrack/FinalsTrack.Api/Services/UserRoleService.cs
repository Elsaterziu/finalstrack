using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoles;

        public UserRoleService(IUserRoleRepository userRoles)
        {
            _userRoles = userRoles;
        }

        public async Task AssignRoleAsync(int userId, int roleId)
        {
            var exists = await _userRoles.ExistsAsync(userId, roleId);
            if (exists) return;

            await _userRoles.AddAsync(new UserRole { UserId = userId, RoleId = roleId });
            await _userRoles.SaveChangesAsync();
        }

        public async Task RemoveRoleAsync(int userId, int roleId)
        {
            var ur = await _userRoles.GetAsync(userId, roleId);
            if (ur == null) return;

            _userRoles.Remove(ur);
            await _userRoles.SaveChangesAsync();
        }

        public async Task<List<string>> GetUserRolesAsync(int userId)
        {
            return await _userRoles.GetRoleNamesByUserIdAsync(userId);
        }
    }
}
