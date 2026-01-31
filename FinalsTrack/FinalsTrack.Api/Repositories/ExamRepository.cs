using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories;

public class ExamRepository : IExamRepository
{
    private readonly FinalsTrackDbContext _context;

    public ExamRepository(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<Exam>> GetBySeasonAsync(int examSeasonId)
        => await _context.Exams
            .Include(e => e.Subject)
            .Where(e => e.ExamSeasonId == examSeasonId)
            .ToListAsync();

    public async Task<Exam?> GetByIdAsync(int id)
        => await _context.Exams
            .Include(e => e.Subject)
            .FirstOrDefaultAsync(e => e.Id == id);

    public async Task AddAsync(Exam entity)
    {
        _context.Exams.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Exam entity)
    {
        _context.Exams.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
