using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRefreshTokenRepository _refreshTokens;

        public RefreshTokenService(IRefreshTokenRepository refreshTokens)
        {
            _refreshTokens = refreshTokens;
        }

        public async Task<RefreshToken> CreateAsync(int userId, string token, DateTime expiresAt)
        {
            var rt = new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = expiresAt,
                IsRevoked = false
            };

            await _refreshTokens.AddAsync(rt);
            await _refreshTokens.SaveChangesAsync();
            return rt;
        }

        public async Task<RefreshToken?> ValidateAsync(string token)
            => await _refreshTokens.GetValidAsync(token);
    }
}
