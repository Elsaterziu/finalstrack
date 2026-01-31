using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services;

public class StressLogService : IStressLogService
{
    private readonly IStressLogRepository _repository;

    public StressLogService(IStressLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<StressLogDto>> GetByExamAsync(int examId)
    {
        var logs = await _repository.GetByExamAsync(examId);

        return logs.Select(sl => new StressLogDto
        {
            Id = sl.Id,
            ExamId = sl.ExamId,
            StressLevel = sl.StressLevel,
            LoggedAt = sl.LoggedAt ?? DateTime.UtcNow
        });
    }

    public async Task<StressLogDto> CreateAsync(CreateStressLogDto dto, int userId)
    {
        var log = new StressLog
        {
            ExamId = dto.ExamId,
            UserId = userId,
            StressLevel = dto.StressLevel,
            LoggedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(log);

        return new StressLogDto
        {
            Id = log.Id,
            ExamId = log.ExamId,
            StressLevel = log.StressLevel,
            LoggedAt = log.LoggedAt!.Value
        };
    }
}
