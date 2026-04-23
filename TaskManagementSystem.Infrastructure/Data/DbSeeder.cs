using Microsoft.EntityFrameworkCore;
using TaskManagementSystem.Domain.Entities;
using TaskManagementSystem.Domain.Enums;
using TaskManagementSystem.Infrastructure.Data;
using BCrypt.Net;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await SeedUsers(context);
        await SeedProjects(context);
    }

    private static async Task SeedUsers(AppDbContext context)
    {
        if (!await context.Users.AnyAsync(u => u.Email == "admin@test.com"))
        {
            context.Users.Add(new User
            {
                Name = "Admin",
                Email = "admin@test.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            });

            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedProjects(AppDbContext context)
    {
        if (!await context.Projects.AnyAsync())
        {
            context.Projects.AddRange(
                new Project { Name = "Demo Project 1", Description = "Test project" },
                new Project { Name = "Demo Project 2", Description = "Another project" }
            );

            await context.SaveChangesAsync();
        }
    }
}