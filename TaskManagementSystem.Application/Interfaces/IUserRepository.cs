using System;
using System.Collections.Generic;
using System.Text;
using TaskManagementSystem.Domain.Entities;

namespace TaskManagementSystem.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(int id);

        Task UpdateAsync(User user);
        Task<User> GetByEmailAsync(string email);

    }
}
