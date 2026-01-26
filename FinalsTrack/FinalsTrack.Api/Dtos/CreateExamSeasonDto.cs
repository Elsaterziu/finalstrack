namespace FinalsTrack.Api.Dtos
{
    public class CreateExamSeasonDto
    {
        public string Title { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
