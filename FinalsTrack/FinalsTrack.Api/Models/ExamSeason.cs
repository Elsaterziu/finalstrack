using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class ExamSeason
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();

    public virtual User User { get; set; }
}