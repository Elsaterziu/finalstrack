using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class StudyBlock
{
    public int Id { get; set; }

    public int ExamId { get; set; }

    public DateOnly StudyDate { get; set; }

    public int DurationMinutes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Exam Exam { get; set; }
}