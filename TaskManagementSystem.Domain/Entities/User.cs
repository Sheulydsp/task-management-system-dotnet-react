using System;
using System.Collections.Generic;
using System.Text;
using TaskManagementSystem.Domain.Enums;

namespace TaskManagementSystem.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        //ßpublic string ProfileImageUrl { get; set; }
        public string? ProfileImageUrl { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public ICollection<Project> Projects { get; set; }
        public ICollection<TaskAssignment> TaskAssignments { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
    }
}
