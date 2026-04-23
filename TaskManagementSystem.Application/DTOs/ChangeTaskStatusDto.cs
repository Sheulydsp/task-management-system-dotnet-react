using System;
using System.Collections.Generic;
using System.Text;

namespace TaskManagementSystem.Application.DTOs
{
    public class ChangeTaskStatusDto
    {
        public int TaskId { get; set; }
        public int NewStatus { get; set; }

        public string RowVersion { get; set; }
    }
}
