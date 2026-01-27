namespace FinalsTrack.Api.Services.Interfaces
{
    public interface IRoleService
    {
        Task EnsureDefaultRolesAsync();
        Task<int?> GetRoleIdByNameAsync(string name);
    }
}
