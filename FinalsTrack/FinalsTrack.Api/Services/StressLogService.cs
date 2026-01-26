using FinalsTrack.Api.Data;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Services;

public class StressLogService : IStressLogService
{
    private readonly FinalsTrackDbContext _context;

    public StressLogService(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StressLogDto>> GetByExamAsync(int examId)
    {
        return await _context.StressLogs
            .Where(sl => sl.ExamId == examId)
            .Select(sl => new StressLogDto
            {
                Id = sl.Id,
                ExamId = sl.ExamId,
                StressLevel = sl.StressLevel,
                LoggedAt = sl.LoggedAt ?? DateTime.UtcNow
            })
            .ToListAsync();
    }

    public async Task<StressLogDto> CreateAsync(CreateStressLogDto dto)
    {
        var log = new StressLog
        {
            ExamId = dto.ExamId,
            StressLevel = dto.StressLevel,
            LoggedAt = DateTime.UtcNow
        };

        _context.StressLogs.Add(log);
        await _context.SaveChangesAsync();

        return new StressLogDto
        {
            Id = log.Id,
            ExamId = log.ExamId,
            StressLevel = log.StressLevel,
            LoggedAt = log.LoggedAt.Value
        };
    }
}
