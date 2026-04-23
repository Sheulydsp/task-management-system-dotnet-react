export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeName?: string;
  createdByName?: string;
  dueDate?: string;   // ✅ ADD THIS
  rowVersion: string;
  projectId: number;
  createdAt: string;
}