namespace FinalsTrack.Api.Dtos
{
    public class StressLogDto
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public int StressLevel { get; set; }
        public DateTime LoggedAt { get; set; }
    }
}
