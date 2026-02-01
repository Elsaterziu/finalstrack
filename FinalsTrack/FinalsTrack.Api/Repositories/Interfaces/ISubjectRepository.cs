using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface ISubjectRepository
{
    Task<List<Subject>> GetAllAsync();
    Task<Subject?> GetByIdAsync(int id);
    Task AddAsync(Subject entity);
    Task UpdateAsync(Subject entity);
    Task DeleteAsync(Subject entity);
}
