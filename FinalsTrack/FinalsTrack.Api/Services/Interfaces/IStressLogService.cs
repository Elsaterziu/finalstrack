using FinalsTrack.Api.Dtos;

namespace FinalsTrack.Api.Services.Interfaces;

public interface IStressLogService
{
    Task<IEnumerable<StressLogDto>> GetByExamAsync(int examId);
    Task<StressLogDto> CreateAsync(CreateStressLogDto dto, int userId);
}
