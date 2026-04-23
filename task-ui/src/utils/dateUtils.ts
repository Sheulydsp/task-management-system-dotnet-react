export const getDueStatus = (dueDate?: string) => {
  if (!dueDate) return "none";

  const today = new Date();
  const due = new Date(dueDate);

  // normalize time
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 2) return "soon";

  return "normal";
};