using TaskManagementSystem.Application.DTOs;

public class ProjectTasksResponseDto
{
    public string ProjectName { get; set; }
    public List<TaskResponseDto> Tasks { get; set; }
}