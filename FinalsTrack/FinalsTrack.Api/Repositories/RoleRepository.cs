using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly FinalsTrackDbContext _context;

        public RoleRepository(FinalsTrackDbContext context)
        {
            _context = context;
        }

        public async Task<Role?> GetByIdAsync(int id)
            => await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);

        public async Task<Role?> GetByNameAsync(string name)
            => await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);

        public async Task<List<Role>> GetAllAsync()
            => await _context.Roles.ToListAsync();

        public async Task AddAsync(Role role)
            => await _context.Roles.AddAsync(role);

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
