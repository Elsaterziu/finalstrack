using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<bool> ExistsAsync(int userId, int roleId);
        Task AddAsync(UserRole userRole);
        Task<int> SaveChangesAsync();
    }
}
