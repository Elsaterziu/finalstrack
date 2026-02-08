using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FinalsTrackDbContext _context;

        public UserRepository(FinalsTrackDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
            => await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        public async Task<User?> GetByEmailAsync(string email)
            => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<List<User>> GetAllAsync()
            => await _context.Users
                .OrderBy(u => u.Id)
                .ToListAsync();

        public async Task<List<User>> GetAllActiveAsync()
            => await _context.Users
                .Where(u => u.IsActive)
                .OrderBy(u => u.Id)
                .ToListAsync();
        public async Task AddAsync(User user)
            => await _context.Users.AddAsync(user);

        public void Update(User user)
            => _context.Users.Update(user);

        public void Delete(User user)
            => _context.Users.Remove(user);

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
