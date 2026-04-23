public class TaskActivity
{
    public int Id { get; set; }

    public int TaskId { get; set; }
    public string Action { get; set; }

    public int PerformedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}