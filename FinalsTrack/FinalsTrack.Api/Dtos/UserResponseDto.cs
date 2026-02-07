namespace FinalsTrack.Api.Dtos
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
        public bool IsActive { get; set; }

    }
}
