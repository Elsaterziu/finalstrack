using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services;

public class ExamSeasonService : IExamSeasonService
{
    private readonly IExamSeasonRepository _repository;

    public ExamSeasonService(IExamSeasonRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExamSeasonDto>> GetAllAsync()
    {
        var seasons = await _repository.GetAllAsync();

        return seasons.Select(es => new ExamSeasonDto
        {
            Id = es.Id,
            Title = es.Title,
            StartDate = es.StartDate,
            EndDate = es.EndDate
        });
    }

    public async Task<ExamSeasonDto?> GetByIdAsync(int id)
    {
        var season = await _repository.GetByIdAsync(id);
        if (season == null) return null;

        return new ExamSeasonDto
        {
            Id = season.Id,
            Title = season.Title,
            StartDate = season.StartDate,
            EndDate = season.EndDate
        };
    }

    public async Task<ExamSeasonDto> CreateAsync(CreateExamSeasonDto dto, int userId)
    {
        var season = new ExamSeason
        {
            Title = dto.Title,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(season);

        return new ExamSeasonDto
        {
            Id = season.Id,
            Title = season.Title,
            StartDate = season.StartDate,
            EndDate = season.EndDate
        };
    }


    public async Task DeleteAsync(int id)
    {
        var season = await _repository.GetByIdAsync(id);
        if (season == null) return;

        await _repository.DeleteAsync(season);
    }
}
