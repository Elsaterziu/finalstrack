using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRefreshTokenRepository _repo;

        public RefreshTokenService(IRefreshTokenRepository repo)
        {
            _repo = repo;
        }

        public async Task CreateAsync(int userId, string token, DateTime expiresAt)
        {
            var entity = new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = expiresAt,
                IsRevoked = false,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
        }

        public async Task<RefreshToken?> ValidateAsync(string token)
        {
            var stored = await _repo.GetByTokenAsync(token);

            if (stored == null)
                return null;

            if (stored.IsRevoked == true)
                return null;

            if (stored.ExpiresAt <= DateTime.UtcNow)
                return null;

            return stored;
        }

        public async Task RevokeAsync(string token)
        {
            var stored = await _repo.GetByTokenAsync(token);
            if (stored == null) return;

            stored.IsRevoked = true;
            stored.RevokedAt = DateTime.UtcNow;

            await _repo.SaveChangesAsync();
        }
    }
}
