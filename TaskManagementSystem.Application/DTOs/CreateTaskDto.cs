using System;
using System.Collections.Generic;
using System.Text;

namespace TaskManagementSystem.Application.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int ProjectId { get; set; }
        public int Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
