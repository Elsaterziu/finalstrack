namespace FinalsTrack.Api.Dtos
{
    public class RemoveRoleDto
    {
        public int UserId { get; set; }
        public string RoleName { get; set; } = null!;
    }
}
