using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly FinalsTrackDbContext _context;

        public RefreshTokenRepository(FinalsTrackDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RefreshToken token)
            => await _context.RefreshTokens.AddAsync(token);

        public async Task<RefreshToken?> GetValidAsync(string token)
            => await _context.RefreshTokens.FirstOrDefaultAsync(rt =>
                rt.Token == token &&
                rt.IsRevoked == false &&
                rt.ExpiresAt > DateTime.UtcNow);

        public async Task<int> SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}
