using TaskManagementSystem.Application.DTOs;
using TaskManagementSystem.Application.Interfaces;
using TaskManagementSystem.Domain.Entities;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<string> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
            throw new Exception("User not found");

        var existing = await _userRepository.GetByEmailAsync(dto.Email);

        if (existing != null && existing.Id != userId)
            throw new Exception("Email already in use");

        user.Name = dto.Name;
        user.Email = dto.Email;

        await _userRepository.UpdateAsync(user);

        return "Profile updated successfully";
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
            throw new Exception("User not found");

        if (user.Password != dto.CurrentPassword)
            throw new Exception("Invalid current password");

        user.Password = dto.NewPassword;

        await _userRepository.UpdateAsync(user);
    }
}