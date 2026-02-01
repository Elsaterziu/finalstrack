using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services;

public class SubjectService : ISubjectService
{
    private readonly ISubjectRepository _repository;

    public SubjectService(ISubjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllAsync()
    {
        var subjects = await _repository.GetAllAsync();

        return subjects.Select(s => new SubjectDto
        {
            Id = s.Id,
            Name = s.Name
        });
    }

    public async Task<SubjectDto?> GetByIdAsync(int id)
    {
        var subject = await _repository.GetByIdAsync(id);
        if (subject == null) return null;

        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name
        };
    }

    public async Task<SubjectDto?> UpdateAsync(int id, UpdateSubjectDto dto, int userId)
    {
        var subject = await _repository.GetByIdAsync(id);
        if (subject == null) return null;

        // ownership check
        if (subject.UserId != userId)
            throw new UnauthorizedAccessException();

        subject.Name = dto.Name;

        await _repository.UpdateAsync(subject);

        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name
        };
    }


    public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto, int userId)
    {
        var subject = new Subject
        {
            Name = dto.Name,
            UserId = userId
        };

        await _repository.AddAsync(subject);

        return new SubjectDto
        {
            Id = subject.Id,
            Name = subject.Name
        };
    }

    public async Task DeleteAsync(int id)
    {
        var subject = await _repository.GetByIdAsync(id);
        if (subject == null) return;

        await _repository.DeleteAsync(subject);
    }
}
