using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly FinalsTrackDbContext _context;

        public UserRoleRepository(FinalsTrackDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(int userId, int roleId)
            => await _context.UserRoles.AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId);

        public async Task AddAsync(UserRole userRole)
            => await _context.UserRoles.AddAsync(userRole);

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
