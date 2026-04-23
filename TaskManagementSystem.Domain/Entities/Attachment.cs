using System;
using System.Collections.Generic;
using System.Text;

namespace TaskManagementSystem.Domain.Entities
{
    public class Attachment
    {
        public int Id { get; set; }

        public int TaskId { get; set; }
        public TaskItem Task { get; set; }

        public string FileName { get; set; }
        public string FilePath { get; set; }

        public int UploadedBy { get; set; }
        public User UploadedUser { get; set; }

        public DateTime UploadedAt { get; set; }
    }
}
