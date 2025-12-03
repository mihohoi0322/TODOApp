import { Todo, TodosResponse } from '../types/Todo';

const API_BASE = '/api';

/**
 * Fetch all todos with optional filter
 */
export async function fetchTodos(filter?: string): Promise<Todo[]> {
  const url = filter ? `${API_BASE}/todos?filter=${filter}` : `${API_BASE}/todos`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch todos: ${response.statusText}`);
  }
  
  const data: TodosResponse = await response.json();
  return data.todos;
}

/**
 * Create a new todo
 */
export async function createTodo(title: string, dueDate?: string): Promise<Todo> {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, dueDate }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create todo');
  }
  
  return response.json();
}

/**
 * Update a todo
 */
export async function updateTodo(
  id: string,
  updates: Partial<Pick<Todo, 'title' | 'completed' | 'dueDate'>>
): Promise<Todo> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update todo');
  }
  
  return response.json();
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete todo');
  }
}

/**
 * Fetch statistics for the last 7 days
 */
export interface DailyStats {
  date: string;
  completed: number;
}

export interface StatsResponse {
  stats: DailyStats[];
}

export async function fetchLast7DaysStats(): Promise<DailyStats[]> {
  const response = await fetch(`${API_BASE}/todos/stats/last7days`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  
  const data: StatsResponse = await response.json();
  return data.stats;
}
