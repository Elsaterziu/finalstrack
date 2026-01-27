namespace FinalsTrack.Api.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
