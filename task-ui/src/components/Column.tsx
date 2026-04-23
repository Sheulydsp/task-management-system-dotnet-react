import TaskCard from "./TaskCard";

interface Props {
  title: string;
  tasks: any[];
  onStatusChange: (taskId: number, status: string) => void;
  onAssigned: () => void;
}

export default function Column({ title, tasks, onStatusChange, onAssigned }: Props) {
  return (
    <div style={{ flex: 1 }}>
      <h5>{title}</h5>

      <div className="bg-light p-2 rounded" style={{ minHeight: "400px" }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onAssigned={onAssigned}
          />
        ))}
      </div>
    </div>
  );
}