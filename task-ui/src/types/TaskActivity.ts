export interface TaskActivity {
  id: number;
  taskId: number;
  action: string;
  performedByUserId: number;
  createdAt: string;
}