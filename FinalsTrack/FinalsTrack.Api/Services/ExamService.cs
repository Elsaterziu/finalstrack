using FinalsTrack.Api.Dtos;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using FinalsTrack.Api.Services.Interfaces;

namespace FinalsTrack.Api.Services;

public class ExamService : IExamService
{
    private readonly IExamRepository _repository;

    public ExamService(IExamRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ExamDto>> GetByExamSeasonAsync(int examSeasonId)
    {
        var exams = await _repository.GetBySeasonAsync(examSeasonId);

        return exams.Select(e => new ExamDto
        {
            Id = e.Id,
            ExamSeasonId = e.ExamSeasonId,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            ExamDate = e.ExamDate,
            ExamTime = e.ExamTime
        });
    }

    public async Task<ExamDto?> GetByIdAsync(int id)
    {
        var exam = await _repository.GetByIdAsync(id);
        if (exam == null) return null;

        return new ExamDto
        {
            Id = exam.Id,
            ExamSeasonId = exam.ExamSeasonId,
            SubjectId = exam.SubjectId,
            SubjectName = exam.Subject.Name,
            ExamDate = exam.ExamDate,
            ExamTime = exam.ExamTime
        };
    }

    public async Task<ExamDto> CreateAsync(CreateExamDto dto)
    {
        var exam = new Exam
        {
            ExamSeasonId = dto.ExamSeasonId,
            SubjectId = dto.SubjectId,
            ExamDate = dto.ExamDate,
            ExamTime = dto.ExamTime,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(exam);

        var created = await _repository.GetByIdAsync(exam.Id)!;

        return new ExamDto
        {
            Id = created.Id,
            ExamSeasonId = created.ExamSeasonId,
            SubjectId = created.SubjectId,
            SubjectName = created.Subject.Name,
            ExamDate = created.ExamDate,
            ExamTime = created.ExamTime
        };
    }

    public async Task DeleteAsync(int id)
    {
        var exam = await _repository.GetByIdAsync(id);
        if (exam == null) return;

        await _repository.DeleteAsync(exam);
    }
}
