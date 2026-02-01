using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);

        Task<User> CreateAsync(string fullName, string email, string password);
        Task<bool> ValidatePasswordAsync(string email, string password);

        Task<bool> UpdateMeAsync(int userId, string fullName);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);

        Task<List<User>> GetAllAsync();      // Admin
        Task<bool> DeleteAsync(int userId);  // Admin
        Task<bool> SetActiveStatusAsync(int userId, bool isActive);

    }
}
