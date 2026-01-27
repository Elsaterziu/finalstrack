using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(string fullName, string email, string password);
        Task<bool> ValidatePasswordAsync(string email, string password);
    }
}
