using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface IStressLogRepository
{
    Task<List<StressLog>> GetByExamAsync(int examId);
    Task AddAsync(StressLog entity);
}
