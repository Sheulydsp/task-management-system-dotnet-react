using TaskManagementSystem.Application.DTOs;
using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Domain.Entities;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;

    public ProjectService(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto dto, int userId)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("Project name is required");

        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _projectRepository.AddAsync(project);

        return new ProjectResponseDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description
        };
    }

    public async Task<List<ProjectResponseDto>> GetAllProjectsAsync()
    {
        var projects = await _projectRepository.GetAllAsync();

        return projects.Select(p => new ProjectResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description
        }).ToList();
    }
}