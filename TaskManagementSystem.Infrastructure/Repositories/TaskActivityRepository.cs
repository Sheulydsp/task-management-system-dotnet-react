using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Infrastructure.Data;

public class TaskActivityRepository : ITaskActivityRepository
{
    private readonly AppDbContext _context;

    public TaskActivityRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(TaskActivity activity)
    {
        _context.TaskActivities.Add(activity);
        await _context.SaveChangesAsync();
    }
}