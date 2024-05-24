import { api } from "./api";

interface GetTasksQuery {
  from?: string;
  to?: string;
  overdue?: boolean;
  onlyPendingTasks?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface TaskList {
  id: number;
  due: string;
  isOverdue: boolean;
  tasks: Task[];
}

export async function getTasks(query: GetTasksQuery) {
  const queryParams = new URLSearchParams();
  if (query.from) queryParams.append("from", query.from);
  if (query.to) queryParams.append("to", query.to);
  if (query.overdue) queryParams.append("overdue", "true");
  if (query.onlyPendingTasks) queryParams.append("onlyPendingTasks", "true");

  const response = await api.get<TaskList[]>(`/tasks?${queryParams.toString()}`);
  return response.data;
}

export async function markTaskAsCompleted(id: number) {
  return api.patch(`/tasks/complete/${id}`);
}

export async function markTaskAsPending(id: number) {
  return api.patch(`/tasks/pending/${id}`);
}