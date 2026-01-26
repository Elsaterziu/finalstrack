namespace FinalsTrack.Api.Dtos
{
    public class CreateStudyBlockDto
    {
        public int ExamId { get; set; }
        public DateOnly StudyDate { get; set; }
        public int DurationMinutes { get; set; }
    }
}
