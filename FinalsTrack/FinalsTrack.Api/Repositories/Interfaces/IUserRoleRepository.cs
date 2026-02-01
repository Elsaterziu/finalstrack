using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<bool> ExistsAsync(int userId, int roleId);
        Task AddAsync(UserRole userRole);

        Task<UserRole?> GetAsync(int userId, int roleId);
        void Remove(UserRole userRole);
        Task<List<string>> GetRoleNamesByUserIdAsync(int userId);

        Task<int> SaveChangesAsync();
    }
}
