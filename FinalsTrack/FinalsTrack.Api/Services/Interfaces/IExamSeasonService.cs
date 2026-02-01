using FinalsTrack.Api.Dtos;

namespace FinalsTrack.Api.Services.Interfaces;

public interface IExamSeasonService
{
    Task<IEnumerable<ExamSeasonDto>> GetAllAsync();
    Task<ExamSeasonDto?> GetByIdAsync(int id);
    Task<ExamSeasonDto> CreateAsync(CreateExamSeasonDto dto, int userId);
    Task<ExamSeasonDto?> UpdateAsync(int id, UpdateExamSeasonDto dto, int userId);
    Task DeleteAsync(int id);
}

