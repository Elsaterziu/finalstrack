using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roles;

        public RoleService(IRoleRepository roles)
        {
            _roles = roles;
        }

        public async Task EnsureDefaultRolesAsync()
        {
            var admin = await _roles.GetByNameAsync("Admin");
            var user = await _roles.GetByNameAsync("User");

            if (admin == null)
                await _roles.AddAsync(new Role { Name = "Admin" });

            if (user == null)
                await _roles.AddAsync(new Role { Name = "User" });

            await _roles.SaveChangesAsync();
        }

        public async Task<int?> GetRoleIdByNameAsync(string name)
        {
            var role = await _roles.GetByNameAsync(name);
            return role?.Id;
        }
    }
}
