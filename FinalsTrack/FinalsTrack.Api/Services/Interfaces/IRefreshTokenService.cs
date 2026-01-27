using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> CreateAsync(int userId, string token, DateTime expiresAt);
        Task<RefreshToken?> ValidateAsync(string token);
    }
}
