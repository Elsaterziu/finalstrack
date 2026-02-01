using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<List<User>> GetAllAsync();

        Task AddAsync(User user);
        void Update(User user);
        void Delete(User user);

        Task<int> SaveChangesAsync();
    }
}
