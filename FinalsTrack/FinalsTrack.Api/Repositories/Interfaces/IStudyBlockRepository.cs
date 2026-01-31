using FinalsTrack.Api.Models;

namespace FinalsTrack.Api.Repositories.Interfaces;

public interface IStudyBlockRepository
{
    Task<List<StudyBlock>> GetByExamAsync(int examId);
    Task<StudyBlock?> GetByIdAsync(int id);
    Task AddAsync(StudyBlock entity);
    Task DeleteAsync(StudyBlock entity);
}
