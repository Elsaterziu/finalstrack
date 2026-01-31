using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories;

public class StudyBlockRepository : IStudyBlockRepository
{
    private readonly FinalsTrackDbContext _context;

    public StudyBlockRepository(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudyBlock>> GetByExamAsync(int examId)
        => await _context.StudyBlocks
            .Where(sb => sb.ExamId == examId)
            .ToListAsync();

    public async Task<StudyBlock?> GetByIdAsync(int id)
        => await _context.StudyBlocks.FindAsync(id);

    public async Task AddAsync(StudyBlock entity)
    {
        _context.StudyBlocks.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(StudyBlock entity)
    {
        _context.StudyBlocks.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
