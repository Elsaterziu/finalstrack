using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken token);
        Task<RefreshToken?> GetValidAsync(string token);
        Task<int> SaveChangesAsync();
    }
}
