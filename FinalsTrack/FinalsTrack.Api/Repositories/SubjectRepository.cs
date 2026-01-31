using FinalsTrack.Api.Data;
using FinalsTrack.Api.Models;
using FinalsTrack.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinalsTrack.Api.Repositories;

public class SubjectRepository : ISubjectRepository
{
    private readonly FinalsTrackDbContext _context;

    public SubjectRepository(FinalsTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<Subject>> GetAllAsync()
        => await _context.Subjects.ToListAsync();

    public async Task<Subject?> GetByIdAsync(int id)
        => await _context.Subjects.FindAsync(id);

    public async Task AddAsync(Subject entity)
    {
        _context.Subjects.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Subject entity)
    {
        _context.Subjects.Remove(entity);
        await _context.SaveChangesAsync();
    }
}
