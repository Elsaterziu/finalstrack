namespace FinalsTrack.Api.Dtos
{
    public class StudyBlockDto
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public DateOnly StudyDate { get; set; }
        public int DurationMinutes { get; set; }
    }
}
