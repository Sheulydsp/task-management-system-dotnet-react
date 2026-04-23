using System;
using System.Collections.Generic;
using System.Text;

namespace TaskManagementSystem.Application.DTOs
{
    public class UpdateTaskDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public int Priority { get; set; }
        public DateTime? DueDate { get; set; }

        public string RowVersion { get; set; } // ✅ MUST be string

    }
}
