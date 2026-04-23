using System;
using System.Collections.Generic;
using System.Text;
using TaskManagementSystem.Domain.Entities;

namespace TaskManagementSystem.Application.Interfaces
{
    public interface ITaskRepository
    {
        Task<TaskItem> AddAsync(TaskItem task);
        Task<List<TaskItem>> GetAllAsync();

        Task<TaskItem> GetByIdAsync(int id);
        Task UpdateAsync(TaskItem task);
        Task<List<TaskItem>> GetTasksByUserAsync(int userId);

        //Task<TaskItem> GetByIdWithAssignmentsAsync(int taskId);

        //Task<bool> IsUserAssignedAsync(int taskId, int userId);

        //Task AddAssignmentAsync(TaskAssignment assignment);
        Task<bool> ProjectExists(int projectId);
        Task<List<TaskItem>> GetTasksByProjectAsync(int projectId);

    }
}
