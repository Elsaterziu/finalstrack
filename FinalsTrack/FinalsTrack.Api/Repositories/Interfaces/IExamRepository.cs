using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface IExamRepository
{
    Task<List<Exam>> GetBySeasonAsync(int examSeasonId);
    Task<Exam?> GetByIdAsync(int id);
    Task AddAsync(Exam entity);
    Task DeleteAsync(Exam entity);
}
