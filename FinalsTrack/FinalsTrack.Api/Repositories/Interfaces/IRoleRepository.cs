using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<Role?> GetByIdAsync(int id);
        Task<Role?> GetByNameAsync(string name);
        Task<List<Role>> GetAllAsync();
        Task AddAsync(Role role);
        Task<int> SaveChangesAsync();
    }
}
