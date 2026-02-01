namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IUserRoleService
    {
        Task AssignRoleAsync(int userId, int roleId);
        Task RemoveRoleAsync(int userId, int roleId);
        Task<List<string>> GetUserRolesAsync(int userId);
    }
}