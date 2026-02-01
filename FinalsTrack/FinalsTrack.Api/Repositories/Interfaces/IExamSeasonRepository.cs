using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface IExamSeasonRepository
{
    Task<List<ExamSeason>> GetAllAsync();
    Task<ExamSeason?> GetByIdAsync(int id);
    Task AddAsync(ExamSeason entity);
    Task UpdateAsync(ExamSeason entity);
    Task DeleteAsync(ExamSeason entity);
}
