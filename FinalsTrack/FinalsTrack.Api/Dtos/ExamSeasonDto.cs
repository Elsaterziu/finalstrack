namespace FinalsTrack.Api.Dtos;

public class ExamSeasonDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
