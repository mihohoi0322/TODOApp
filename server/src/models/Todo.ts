export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  dueDate?: string | null;
}
