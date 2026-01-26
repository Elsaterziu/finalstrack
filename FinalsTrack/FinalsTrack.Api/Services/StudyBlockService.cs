using FinalsTrack.Api.Data;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Services;

public class StudyBlockService : IStudyBlockService
{
    private readonly FinalsTrackDbContext _context;

    public StudyBlockService(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StudyBlockDto>> GetByExamAsync(int examId)
    {
        return await _context.StudyBlocks
            .Where(sb => sb.ExamId == examId)
            .Select(sb => new StudyBlockDto
            {
                Id = sb.Id,
                ExamId = sb.ExamId,
                StudyDate = sb.StudyDate,
                DurationMinutes = sb.DurationMinutes
            })
            .ToListAsync();
    }

    public async Task<StudyBlockDto> CreateAsync(CreateStudyBlockDto dto)
    {
        var block = new StudyBlock
        {
            ExamId = dto.ExamId,
            StudyDate = dto.StudyDate,
            DurationMinutes = dto.DurationMinutes,
            CreatedAt = DateTime.UtcNow
        };

        _context.StudyBlocks.Add(block);
        await _context.SaveChangesAsync();

        return new StudyBlockDto
        {
            Id = block.Id,
            ExamId = block.ExamId,
            StudyDate = block.StudyDate,
            DurationMinutes = block.DurationMinutes
        };
    }

    public async Task DeleteAsync(int id)
    {
        var block = await _context.StudyBlocks.FindAsync(id);
        if (block == null) return;

        _context.StudyBlocks.Remove(block);
        await _context.SaveChangesAsync();
    }
}
