using TaskManagementSystem.Application.DTOs;

public interface IProjectService
{
    Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto dto, int userId);
    Task<List<ProjectResponseDto>> GetAllProjectsAsync();
}