namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IUserRoleService
    {
        Task AssignRoleAsync(int userId, int roleId);
    }
}
