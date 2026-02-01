using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface IExamRepository
{
    Task<List<Exam>> GetBySeasonAsync(int examSeasonId);
    Task<Exam?> GetByIdAsync(int id);
    Task<ExamSeason?> GetExamSeasonAsync(int examSeasonId);

    Task AddAsync(Exam entity);
    Task UpdateAsync(Exam exam);
    Task DeleteAsync(Exam entity);
}
