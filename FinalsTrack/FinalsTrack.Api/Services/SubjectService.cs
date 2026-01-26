using FinalsTrack.Api.Data;
using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Services;

public class SubjectService : ISubjectService
{
    private readonly FinalsTrackDbContext _context;

    public SubjectService(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllAsync()
    {
        return await _context.Subjects
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                Name = s.Name
            })
            .ToListAsync();
    }

    public async Task<SubjectDto> GetByIdAsync(int id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null) return null;

        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name
        };
    }

    public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto)
    {
        var subject = new Subject
        {
            Name = dto.Name
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name
        };
    }

    public async Task DeleteAsync(int id)
    {
        var subject = await _context.Subjects.FindAsync(id);
        if (subject == null) return;

        _context.Subjects.Remove(subject);
        await _context.SaveChangesAsync();
    }
}
