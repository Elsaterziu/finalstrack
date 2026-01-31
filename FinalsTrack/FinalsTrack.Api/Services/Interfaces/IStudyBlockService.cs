using FinalsTrack.Api.Dtos;

namespace FinalsTrack.Api.Services.Interfaces;

public interface IStudyBlockService
{
    Task<IEnumerable<StudyBlockDto>> GetByExamAsync(int examId);
    Task<StudyBlockDto> CreateAsync(CreateStudyBlockDto dto);
    Task DeleteAsync(int id);
}
