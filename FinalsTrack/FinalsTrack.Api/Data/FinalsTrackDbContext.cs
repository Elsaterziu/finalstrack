using System;
using System.Collections.Generic;
using FinalsTrack.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Data;

public partial class FinalsTrackDbContext : DbContext
{
    public FinalsTrackDbContext(DbContextOptions<FinalsTrackDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Exam> Exams { get; set; }

    public virtual DbSet<ExamSeason> ExamSeasons { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<StressLog> StressLogs { get; set; }

    public virtual DbSet<StudyBlock> StudyBlocks { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Exam>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Exams__3214EC07B7A4CA22");

            entity.HasIndex(e => e.ExamSeasonId, "IDX_Exams_Season");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.ExamSeason).WithMany(p => p.Exams)
                .HasForeignKey(d => d.ExamSeasonId)
                .HasConstraintName("FK__Exams__ExamSeaso__5BE2A6F2");

            entity.HasOne(d => d.Subject).WithMany(p => p.Exams)
                .HasForeignKey(d => d.SubjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Exams__SubjectId__5CD6CB2B");
        });

        modelBuilder.Entity<ExamSeason>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ExamSeas__3214EC07FE40C689");

            entity.HasIndex(e => e.UserId, "IDX_ExamSeasons_User");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.ExamSeasons)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ExamSeaso__UserI__5535A963");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RefreshT__3214EC07ADFE3E3A");

            entity.Property(e => e.IsRevoked).HasDefaultValue(false);
            entity.Property(e => e.Token)
                .IsRequired()
                .HasMaxLength(255);

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__RefreshTo__UserI__6B24EA82");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC071AAB8DD4");

            entity.HasIndex(e => e.Name, "UQ__Roles__737584F607A16432").IsUnique();

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<StressLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__StressLo__3214EC07E732E441");

            entity.HasIndex(e => e.ExamId, "IDX_StressLogs_Exam");

            entity.Property(e => e.LoggedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Exam).WithMany(p => p.StressLogs)
                .HasForeignKey(d => d.ExamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__StressLog__ExamI__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.StressLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__StressLog__UserI__6754599E");
        });

        modelBuilder.Entity<StudyBlock>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__StudyBlo__3214EC07B3248FE4");

            entity.HasIndex(e => e.ExamId, "IDX_StudyBlocks_Exam");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Exam).WithMany(p => p.StudyBlocks)
                .HasForeignKey(d => d.ExamId)
                .HasConstraintName("FK__StudyBloc__ExamI__619B8048");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Subjects__3214EC0739896549");

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Subjects__UserId__5812160E");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07173AFF43");

            entity.HasIndex(e => e.Email, "IDX_Users_Email");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D105345575DE0B").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(150);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId }).HasName("PK__UserRole__AF2760ADD551FEA4");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__UserRoles__RoleI__5165187F");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserRoles__UserI__5070F446");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}