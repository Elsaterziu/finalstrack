using FinalsTrack.Api.Data;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Services;

public class ExamService : IExamService
{
    private readonly FinalsTrackDbContext _context;

    public ExamService(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExamDto>> GetByExamSeasonAsync(int examSeasonId)
    {
        return await _context.Exams
            .Include(e => e.Subject)
            .Where(e => e.ExamSeasonId == examSeasonId)
            .Select(e => new ExamDto
            {
                Id = e.Id,
                ExamSeasonId = e.ExamSeasonId,
                SubjectId = e.SubjectId,
                SubjectName = e.Subject.Name,
                ExamDate = e.ExamDate,
                ExamTime = e.ExamTime
            })
            .ToListAsync();
    }

    public async Task<ExamDto> GetByIdAsync(int id)
    {
        var exam = await _context.Exams
            .Include(e => e.Subject)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (exam == null) return null;

        return new ExamDto
        {
            Id = exam.Id,
            ExamSeasonId = exam.ExamSeasonId,
            SubjectId = exam.SubjectId,
            SubjectName = exam.Subject.Name,
            ExamDate = exam.ExamDate,
            ExamTime = exam.ExamTime
        };
    }

    public async Task<ExamDto> CreateAsync(CreateExamDto dto)
    {
        var exam = new Exam
        {
            ExamSeasonId = dto.ExamSeasonId,
            SubjectId = dto.SubjectId,
            ExamDate = dto.ExamDate,
            ExamTime = dto.ExamTime,
            CreatedAt = DateTime.UtcNow
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(exam.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null) return;

        _context.Exams.Remove(exam);
        await _context.SaveChangesAsync();
    }
}
