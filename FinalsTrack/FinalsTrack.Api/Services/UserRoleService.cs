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
    }
}
