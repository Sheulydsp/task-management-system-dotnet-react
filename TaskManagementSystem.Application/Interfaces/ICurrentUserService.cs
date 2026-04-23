using TaskManagementSystem.Domain.Entities;

namespace TaskManagementSystem.Application.Interfaces
{
    public interface ICurrentUserService
    {
        public int UserId { get; }
        public string Role { get; }
    }

 }   
