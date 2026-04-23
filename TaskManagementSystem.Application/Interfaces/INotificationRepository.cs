using TaskManagementSystem.Domain.Entities;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);
    Task<List<Notification>> GetByUserIdAsync(int userId);
    Task MarkAsReadAsync(int id);
}