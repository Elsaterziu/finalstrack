using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class Exam
{
    public int Id { get; set; }

    public int ExamSeasonId { get; set; }

    public int SubjectId { get; set; }

    public DateOnly ExamDate { get; set; }

    public TimeOnly ExamTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ExamSeason ExamSeason { get; set; }

    public virtual ICollection<StressLog> StressLogs { get; set; } = new List<StressLog>();

    public virtual ICollection<StudyBlock> StudyBlocks { get; set; } = new List<StudyBlock>();

    public virtual Subject Subject { get; set; }
}