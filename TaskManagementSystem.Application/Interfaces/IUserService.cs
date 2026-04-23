using System.Threading.Tasks;
using TaskManagementSystem.Application.DTOs;

namespace TaskManagementSystem.Application.Interfaces
{
    public interface IUserService
    {
        // ✅ Update profile (name + email)
        Task<string> UpdateProfileAsync(int userId, UpdateProfileDto dto);

        // ✅ Change password (recommended feature)
        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}