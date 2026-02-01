namespace FinalsTrack.Api.Dtos
{
    public class UpdateExamSeasonDto
    {
        public string Title { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
