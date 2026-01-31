using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories;

public class StressLogRepository : IStressLogRepository
{
    private readonly FinalsTrackDbContext _context;

    public StressLogRepository(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<StressLog>> GetByExamAsync(int examId)
        => await _context.StressLogs
            .Where(sl => sl.ExamId == examId)
            .ToListAsync();

    public async Task AddAsync(StressLog entity)
    {
        _context.StressLogs.Add(entity);
        await _context.SaveChangesAsync();
    }
}
