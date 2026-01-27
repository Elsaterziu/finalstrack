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

        public async Task<User> CreateAsync(string fullName, string email, string password)
        {
            var existing = await _users.GetByEmailAsync(email);
            if (existing != null)
                throw new InvalidOperationException("User already exists");

            var user = new User
            {
                FullName = fullName,
                Email = email,
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
    }
}
