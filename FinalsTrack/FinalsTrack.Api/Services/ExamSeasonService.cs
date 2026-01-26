using FinalsTrack.Api.Data;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Services;

public class ExamSeasonService : IExamSeasonService
{
    private readonly FinalsTrackDbContext _context;

    public ExamSeasonService(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExamSeasonDto>> GetAllAsync()
    {
        return await _context.ExamSeasons
            .Select(es => new ExamSeasonDto
            {
                Id = es.Id,
                Title = es.Title,
                StartDate = es.StartDate,
                EndDate = es.EndDate
            })
            .ToListAsync();
    }

    public async Task<ExamSeasonDto> GetByIdAsync(int id)
    {
        var season = await _context.ExamSeasons.FindAsync(id);
        if (season == null) return null;

        return new ExamSeasonDto
        {
            Id = season.Id,
            Title = season.Title,
            StartDate = season.StartDate,
            EndDate = season.EndDate
        };
    }

    public async Task<ExamSeasonDto> CreateAsync(CreateExamSeasonDto dto)
    {
        var season = new ExamSeason
        {
            Title = dto.Title,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            CreatedAt = DateTime.UtcNow
        };

        _context.ExamSeasons.Add(season);
        await _context.SaveChangesAsync();

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
        var season = await _context.ExamSeasons.FindAsync(id);
        if (season == null) return;

        _context.ExamSeasons.Remove(season);
        await _context.SaveChangesAsync();
    }
}
