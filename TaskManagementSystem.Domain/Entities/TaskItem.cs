using System.Net.Mail;
using TaskManagementSystem.Domain.Enums;

namespace TaskManagementSystem.Domain.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public TaskItemStatus Status { get; set; }
        public TaskPriority Priority { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public int CreatedBy { get; set; }
        public User Creator { get; set; }

        public byte[] RowVersion { get; set; }
        public int? AssigneeId { get; set; }
        public User Assignee { get; set; }

        // Navigation
        //public ICollection<TaskAssignment> Assignments { get; set; }
        //public ICollection<TaskAssignment> Assignments { get; set; } = new List<TaskAssignment>();
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Attachment> Attachments { get; set; }
    }
}
