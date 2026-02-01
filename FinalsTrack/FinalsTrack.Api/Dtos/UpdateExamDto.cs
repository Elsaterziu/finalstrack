namespace FinalsTrack.Api.Dtos
{
    public class UpdateExamDto
    {
        public DateOnly ExamDate { get; set; }
        public TimeOnly ExamTime { get; set; }
        public int SubjectId { get; set; }
    }
}
