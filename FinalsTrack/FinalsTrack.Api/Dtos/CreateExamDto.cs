namespace FinalsTrack.Api.Dtos
{
    public class CreateExamDto
    {
        public int ExamSeasonId { get; set; }
        public int SubjectId { get; set; }
        public DateOnly ExamDate { get; set; }
        public TimeOnly ExamTime { get; set; }
    }
}
