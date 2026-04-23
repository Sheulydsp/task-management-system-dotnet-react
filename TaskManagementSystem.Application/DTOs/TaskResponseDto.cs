using System;
using System.Collections.Generic;
using System.Text;

namespace TaskManagementSystem.Application.DTOs
{
    public class TaskResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public string Status { get; set; }
        public string Priority { get; set; }
        public string CreatedByName { get; set; }
        public string AssigneeName { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> AssignedUsers { get; set; }
        public int ProjectId { get; set; }
        public string RowVersion { get; set; }

    }
}
