using FinalsTrack.Api.Dtos;

namespace FinalsTrack.Api.Services.Interfaces;

public interface IExamService
{
    Task<IEnumerable<ExamDto>> GetByExamSeasonAsync(int examSeasonId);
    Task<ExamDto?> GetByIdAsync(int id);
    Task<ExamDto> CreateAsync(CreateExamDto dto, int userId);
    Task<ExamDto?> UpdateAsync(int id, UpdateExamDto dto, int userId);
    Task DeleteAsync(int id);
}
