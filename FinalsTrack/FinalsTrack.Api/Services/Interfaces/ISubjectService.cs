using FinalsTrack.Api.Dtos;

namespace FinalsTrack.Api.Services.Interfaces;

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllAsync();
    Task<SubjectDto> GetByIdAsync(int id);
    Task<SubjectDto> CreateAsync(CreateSubjectDto dto, int userId);
    Task DeleteAsync(int id);
}
