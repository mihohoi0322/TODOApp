export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodosResponse {
  todos: Todo[];
}
