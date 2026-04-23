using TaskManagementSystem.Domain.Entities;


namespace TaskManagementSystem.Application.Interfaces
{
    public interface IProjectRepository
    {
        Task<Project> AddAsync(Project project);
        Task<List<Project>> GetAllAsync();
        Task<Project> GetByIdAsync(int id);
    }

}