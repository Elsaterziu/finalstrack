namespace FinalsTrack.Api.Dtos
{
    public class ExamDto
    {
        public int Id { get; set; }
        public int ExamSeasonId { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public DateOnly ExamDate { get; set; }
        public TimeOnly ExamTime { get; set; }
    }
}
