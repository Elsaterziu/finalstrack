using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services;

public class StudyBlockService : IStudyBlockService
{
    private readonly IStudyBlockRepository _repository;

    public StudyBlockService(IStudyBlockRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<StudyBlockDto>> GetByExamAsync(int examId)
    {
        var blocks = await _repository.GetByExamAsync(examId);

        return blocks.Select(sb => new StudyBlockDto
        {
            Id = sb.Id,
            ExamId = sb.ExamId,
            StudyDate = sb.StudyDate,
            DurationMinutes = sb.DurationMinutes
        });
    }

    public async Task<StudyBlockDto> CreateAsync(CreateStudyBlockDto dto)
    {
        var block = new StudyBlock
        {
            ExamId = dto.ExamId,
            StudyDate = dto.StudyDate,
            DurationMinutes = dto.DurationMinutes,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(block);

        return new StudyBlockDto
        {
            Id = block.Id,
            ExamId = block.ExamId,
            StudyDate = block.StudyDate,
            DurationMinutes = block.DurationMinutes
        };
    }

    public async Task DeleteAsync(int id)
    {
        var block = await _repository.GetByIdAsync(id);
        if (block == null) return;

        await _repository.DeleteAsync(block);
    }
}
