using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class StressLog
{
    public int Id { get; set; }

    public int ExamId { get; set; }

    public int UserId { get; set; }

    public int StressLevel { get; set; }

    public DateTime? LoggedAt { get; set; }

    public virtual Exam Exam { get; set; }

    public virtual User User { get; set; }
}