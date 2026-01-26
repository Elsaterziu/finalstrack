using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.DTOs;

namespace FinalsTrack.Api.Services.Interfaces;

public interface IStudyBlockService
{
    Task<IEnumerable<StudyBlockDto>> GetByExamAsync(int examId);
    Task<StudyBlockDto> CreateAsync(CreateStudyBlockDto dto);
    Task DeleteAsync(int id);
}
