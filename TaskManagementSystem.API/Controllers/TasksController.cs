using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagementSystem.Application.DTOs;
using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Domain.Enums;

namespace TaskManagementSystem.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : BaseController
    {
        private readonly ITaskService _taskService;
        private readonly AppDbContext _context;

        public TasksController(ITaskService taskService, AppDbContext context)
        {
            _taskService = taskService;
            _context = context;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateTaskDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var result = await _taskService.CreateTaskAsync(dto, userId);

            return Ok(result);
        }
        [Authorize(Roles = "Admin,Manager,User")]
        [HttpGet]

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var result = await _taskService.GetAllTasksAsync(userId, role);

            return Ok(result);
        }

        [HttpGet("{id}/activity")]
        public async Task<IActionResult> GetTaskActivity(int id)
        {
            var activities = await _context.TaskActivities
                .Where(a => a.TaskId == id)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();

            return Ok(activities);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            return Ok(task);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
        {
            var userId = GetUserId();
            var role = GetUserRole();

            var result = await _taskService.UpdateTaskAsync(id, dto, userId, role);

            return Ok(result);
        }
        [Authorize(Roles = "Admin,Manager,User")]
        [HttpPatch("status")]

        public async Task<IActionResult> ChangeStatus(ChangeTaskStatusDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userIdClaim == null || roleClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim);
            var role = roleClaim;

            var result = await _taskService.ChangeStatusAsync(dto, userId, role);

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id) { return Ok(id); }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost("assign")]


        public async Task<IActionResult> AssignTask(AssignTaskDto dto)
        {
            var result = await _taskService.AssignTaskAsync(dto);
            return Ok(result);
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasksByProject(int projectId)
        {
            var tasks = await _taskService.GetTasksByProjectAsync(projectId);
            return Ok(tasks);
        }

        [Authorize]
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var tasks = await _context.Tasks.ToListAsync();

            var total = tasks.Count;
            var completed = tasks.Count(t => t.Status == TaskItemStatus.Done);
            var overdue = tasks.Count(t => t.DueDate < DateTime.UtcNow && t.Status != TaskItemStatus.Done);

            var completionRate = total == 0 ? 0 : (int)((double)completed / total * 100);

            var mostUrgent = tasks
                .Where(t => t.Status != TaskItemStatus.Done)
                .OrderBy(t => t.DueDate)
                .ThenByDescending(t => t.Priority)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    Priority = t.Priority.ToString(),
                    t.DueDate
                })
                .FirstOrDefault();

            return Ok(new
            {
                total,
                completed,
                overdue,
                completionRate,
                mostUrgent
            });
        }

    }
}