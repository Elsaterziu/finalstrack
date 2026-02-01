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

        public async Task<UserRole?> GetAsync(int userId, int roleId)
            => await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);

        public void Remove(UserRole userRole)
            => _context.UserRoles.Remove(userRole);

        public async Task<List<string>> GetRoleNamesByUserIdAsync(int userId)
            => await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Name)
                .ToListAsync();

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
