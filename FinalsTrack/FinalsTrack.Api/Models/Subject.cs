using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class Subject
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; }

    public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();

    public virtual User User { get; set; }
}