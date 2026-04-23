using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskManagementSystem.Application.Common.Exceptions;
using TaskManagementSystem.Application.DTOs;
using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Domain.Enums;


namespace TaskManagementSystem.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository; // add this
        private readonly ILogger<TaskService> _logger;
        private readonly IProjectRepository _projectRepository;
        private readonly ITaskActivityRepository _activityRepository;
        private readonly INotificationRepository _notificationRepository;
        //private readonly AppDbContext _context;

        public TaskService(
            ITaskRepository taskRepository,
            IUserRepository userRepository,
            IProjectRepository projectRepository,
            ITaskActivityRepository activityRepository,
            INotificationRepository notificationRepository,

            ILogger<TaskService> logger)
        {
            _taskRepository = taskRepository;
            _userRepository = userRepository;
            _projectRepository = projectRepository;
            _activityRepository = activityRepository;
            _notificationRepository = notificationRepository;
            _logger = logger;

        }

        public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, int userId)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new Exception("Task title is required");

            if (dto.DueDate.HasValue && dto.DueDate < DateTime.UtcNow)
                throw new Exception("Due date must be in the future");

            if (!Enum.IsDefined(typeof(TaskPriority), dto.Priority))
                throw new BadRequestException("Invalid priority");

            var projectExists = await _taskRepository.ProjectExists(dto.ProjectId);

            if (!projectExists)
                throw new BadRequestException("Invalid ProjectId");

            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                ProjectId = dto.ProjectId,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                Status = TaskItemStatus.Todo,
                Priority = (TaskPriority)dto.Priority,
                DueDate = dto.DueDate
            };

            // ✅ Already saves + generates ID
            await _taskRepository.AddAsync(task);

            // ✅ Activity log (correct)
            await _activityRepository.AddAsync(new TaskActivity
            {
                TaskId = task.Id,
                Action = $"Task created: {task.Title}",
                PerformedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            });

            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                RowVersion = Convert.ToBase64String(task.RowVersion)
            };
        }

        public async Task<List<TaskResponseDto>> GetAllTasksAsync(int userId, string role)
        {
            List<TaskItem> tasks;

            if (role == "Admin")
                tasks = await _taskRepository.GetAllAsync();
            else
                tasks = await _taskRepository.GetTasksByUserAsync(userId);

            return tasks.Select(t => new TaskResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status.ToString(),
                Priority = t.Priority.ToString(),
                CreatedAt = t.CreatedAt,
                DueDate = t.DueDate,
                CreatedByName = t.Creator?.Name,
                AssigneeName = t.Assignee?.Name,
                ProjectId = t.ProjectId,
                RowVersion = Convert.ToBase64String(t.RowVersion)
            }).ToList();
        }

        public async Task<TaskResponseDto> GetTaskByIdAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);

            if (task == null)
                throw new NotFoundException("Task not found");

            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                AssigneeName = task.Assignee?.Name,
                CreatedByName = task.Creator?.Name,
                RowVersion = Convert.ToBase64String(task.RowVersion)
            };
        }

        public async Task<ProjectTasksResponseDto> GetTasksByProjectAsync(int projectId)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);

            if (project == null)
                throw new NotFoundException("Project not found");

            var tasks = await _taskRepository.GetTasksByProjectAsync(projectId);

            return new ProjectTasksResponseDto
            {
                ProjectName = project.Name,
                Tasks = tasks.Select(t => new TaskResponseDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    CreatedAt = t.CreatedAt,
                    DueDate = t.DueDate,
                    ProjectId = t.ProjectId,
                    CreatedByName = t.Creator.Name,
                    AssigneeName = t.Assignee != null ? t.Assignee.Name : null,
                    RowVersion = Convert.ToBase64String(t.RowVersion)
                }).ToList()
            };
        }
        public async Task<TaskResponseDto> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId, string role)
        {
            var task = await _taskRepository.GetByIdAsync(id);

            if (task == null)
                throw new Exception("Task not found");

            if (task.Status == TaskItemStatus.Done)
                throw new Exception("Completed task cannot be modified");

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new Exception("Title is required");

            if (!Enum.IsDefined(typeof(TaskPriority), dto.Priority))
                throw new Exception("Invalid priority");

            // ✅ Authorization (single assignee)
            if (task.AssigneeId != userId && role != "Admin")
                throw new UnauthorizedException("You are not assigned to this task");
            if (dto.DueDate.HasValue && dto.DueDate < DateTime.UtcNow.Date)
                throw new Exception("Due date must be today or future");

            // 🔄 Concurrency
            var rowVersion = Convert.FromBase64String(dto.RowVersion);
            if (!task.RowVersion.SequenceEqual(rowVersion))
                throw new Exception("Task was modified by another user");

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Priority = (TaskPriority)dto.Priority;
            task.DueDate = dto.DueDate;

            await _taskRepository.UpdateAsync(task);

            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedAt = task.CreatedAt,
                RowVersion = Convert.ToBase64String(task.RowVersion)
            };
        }

        public async Task<TaskResponseDto> ChangeStatusAsync(ChangeTaskStatusDto dto, int userId, string role)
        {
            var task = await _taskRepository.GetByIdAsync(dto.TaskId);

            if (task == null)
                throw new NotFoundException("Task not found");

            // ✅ ONLY assignee can update
            var isAdmin = role == "Admin";

            if (!isAdmin && task.AssigneeId != userId)
                throw new UnauthorizedException("You are not allowed to update this task");

            var newStatus = (TaskItemStatus)dto.NewStatus;

            // 🔐 Concurrency FIX
            var rowVersion = Convert.FromBase64String(dto.RowVersion);

            if (!task.RowVersion.SequenceEqual(rowVersion))
                throw new Exception("Task was modified by another user");

            // 🔒 Rules
            if (task.Status == TaskItemStatus.Done)
                throw new Exception("Completed task cannot be changed");

            if (task.Status == TaskItemStatus.Todo && newStatus == TaskItemStatus.Done)
                throw new Exception("Cannot move directly from Todo to Done");

            if ((int)newStatus < (int)task.Status)
                throw new Exception("Cannot move backward in status");

            task.Status = newStatus;

            await _taskRepository.UpdateAsync(task);

            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                Priority = task.Priority.ToString(),
                CreatedAt = task.CreatedAt,
                RowVersion = Convert.ToBase64String(task.RowVersion)
            };
        }

        public async Task<string> AssignTaskAsync(AssignTaskDto dto)
        {
            var task = await _taskRepository.GetByIdAsync(dto.TaskId);

            if (task == null)
                throw new NotFoundException("Task not found");

            var user = await _userRepository.GetByIdAsync(dto.UserId);

            if (user == null)
                throw new NotFoundException("User not found");

            if (!user.IsActive)
                throw new Exception("User is inactive");

            // prevent duplicate assignment
            if (task.AssigneeId == dto.UserId)
                return "User already assigned to this task";

            // assign
            task.AssigneeId = dto.UserId;

            await _taskRepository.UpdateAsync(task);

            // 🔥 ADD THIS BLOCK (THIS WAS MISSING)
            await _notificationRepository.AddAsync(new Notification
            {
                UserId = dto.UserId,
                Message = $"You have been assigned to task: {task.Title}",
                CreatedAt = DateTime.UtcNow
            });

            _logger.LogInformation(
                "Task {TaskId} assigned to User {UserId}",
                dto.TaskId,
                dto.UserId
            );

            return "Task assigned successfully";
        }



    }
}