using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Infrastructure.Data;

namespace TaskManagementSystem.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TaskItem> AddAsync(TaskItem task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<List<TaskItem>> GetAllAsync()
        {
            return await _context.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Creator)
            .ToListAsync();
        }

        public async Task<TaskItem> GetByIdAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.Creator)
                .Include(t => t.Assignee)   // ✅ FIX
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task UpdateAsync(TaskItem task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TaskItem>> GetTasksByUserAsync(int userId)
        {
            return await _context.Tasks
                .Include(t => t.Creator)
                .Include(t => t.Assignee)
                .Where(t => t.AssigneeId == userId)
                .ToListAsync();
        }


        public async Task<bool> ProjectExists(int projectId)
        {
            return await _context.Projects.AnyAsync(p => p.Id == projectId);
        }

        public async Task<List<TaskItem>> GetTasksByProjectAsync(int projectId)
        {
            return await _context.Tasks
                .Include(t => t.Assignee)
                .Include(t => t.Creator)
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();
        }


    }
}
