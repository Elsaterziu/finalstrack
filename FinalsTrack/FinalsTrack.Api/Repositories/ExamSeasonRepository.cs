using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories;

public class ExamSeasonRepository : IExamSeasonRepository
{
    private readonly FinalsTrackDbContext _context;

    public ExamSeasonRepository(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<ExamSeason>> GetAllAsync()
        => await _context.ExamSeasons.ToListAsync();

    public async Task<ExamSeason?> GetByIdAsync(int id)
        => await _context.ExamSeasons.FindAsync(id);

    public async Task AddAsync(ExamSeason entity)
    {
        _context.ExamSeasons.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ExamSeason entity)
    {
        _context.ExamSeasons.Update(entity);
        await _context.SaveChangesAsync();
    }


    public async Task DeleteAsync(ExamSeason entity)
    {
        _context.ExamSeasons.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
