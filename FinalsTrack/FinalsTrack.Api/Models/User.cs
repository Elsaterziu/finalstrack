using System;
using System.Collections.Generic;

namespace FinalsTrack.Api.Models;

public partial class User
{
    public int Id { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    public string PasswordHash { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<ExamSeason> ExamSeasons { get; set; } = new List<ExamSeason>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<StressLog> StressLogs { get; set; } = new List<StressLog>();

    public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}