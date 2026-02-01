using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;

        public UserService(IUserRepository users)
        {
            _users = users;
        }

        public async Task<User?> GetByEmailAsync(string email)
            => await _users.GetByEmailAsync(email);

        public async Task<User?> GetByIdAsync(int id)
            => await _users.GetByIdAsync(id);

        public async Task<User> CreateAsync(string fullName, string email, string password)
        {
            var existing = await _users.GetByEmailAsync(email);
            if (existing != null)
                throw new InvalidOperationException("User already exists");

            var user = new User
            {
                FullName = fullName.Trim(),
                Email = email.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _users.AddAsync(user);
            await _users.SaveChangesAsync();
            return user;
        }

        public async Task<bool> ValidatePasswordAsync(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email);
            if (user == null) return false;

            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        }

        public async Task<bool> UpdateMeAsync(int userId, string fullName)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user == null) return false;

            user.FullName = fullName.Trim();
            _users.Update(user);
            await _users.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user == null) return false;

            var ok = BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash);
            if (!ok) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _users.Update(user);
            await _users.SaveChangesAsync();
            return true;
        }

        public async Task<List<User>> GetAllAsync()
            => await _users.GetAllAsync();

        public async Task<bool> DeleteAsync(int userId)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user == null) return false;

            _users.Delete(user);
            await _users.SaveChangesAsync();
            return true;
        }
        public async Task<bool> SetActiveStatusAsync(int userId, bool isActive)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user == null) return false;

            user.IsActive = isActive;
            _users.Update(user);
            await _users.SaveChangesAsync();
            return true;
        }

    }
}
