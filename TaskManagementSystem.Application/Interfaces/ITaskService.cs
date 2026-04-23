using System;
using System.Collections.Generic;
using System.Text;
using TaskManagementSystem.Application.DTOs;

namespace TaskManagementSystem.Application.Interfaces
{
    public interface ITaskService
    {
        Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, int userId);

        Task<List<TaskResponseDto>> GetAllTasksAsync(int userId, string role);
        //Task<List<TaskResponseDto>> GetAllTasksAsync(int userId, string role);

        Task<TaskResponseDto> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId, string role);

        Task<TaskResponseDto> ChangeStatusAsync(ChangeTaskStatusDto dto, int userId, string role);
        Task<ProjectTasksResponseDto> GetTasksByProjectAsync(int projectId);
        Task<TaskResponseDto> GetTaskByIdAsync(int id);

        Task<string> AssignTaskAsync(AssignTaskDto dto);
    }
}
