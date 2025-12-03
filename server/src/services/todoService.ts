import { Todo, CreateTodoInput, UpdateTodoInput } from '../models/Todo.js';

// In-memory storage
let todos: Todo[] = [];

// Helper: Check if date is today
function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// Get all todos with optional filter
export function getAllTodos(filter?: string): Todo[] {
  let filteredTodos = [...todos];

  switch (filter) {
    case 'today':
      // Tasks due today
      filteredTodos = todos.filter(
        (todo) => todo.dueDate !== null && isToday(todo.dueDate)
      );
      break;
    case 'inbox':
      // Tasks without due date
      filteredTodos = todos.filter((todo) => todo.dueDate === null);
      break;
    case 'upcoming':
      // Tasks with due date, sorted by due date ascending
      filteredTodos = todos
        .filter((todo) => todo.dueDate !== null)
        .sort((a, b) => {
          const dateA = new Date(a.dueDate!).getTime();
          const dateB = new Date(b.dueDate!).getTime();
          return dateA - dateB;
        });
      break;
    case 'completedToday':
      // Tasks completed today
      filteredTodos = todos.filter(
        (todo) => todo.completedAt !== null && isToday(todo.completedAt)
      );
      break;
    case 'all':
    default:
      // All tasks sorted by createdAt descending
      filteredTodos = [...todos].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  return filteredTodos;
}

// Get todo by ID
export function getTodoById(id: string): Todo | undefined {
  return todos.find((todo) => todo.id === id);
}

// Create new todo
export function createTodo(input: CreateTodoInput): Todo {
  const now = new Date().toISOString();
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title: input.title,
    completed: false,
    completedAt: null,
    dueDate: input.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  todos.push(newTodo);
  return newTodo;
}

// Update todo
export function updateTodo(
  id: string,
  updates: UpdateTodoInput
): Todo | undefined {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return undefined;
  }

  const now = new Date().toISOString();
  const currentTodo = todos[index];

  // Handle completedAt based on completed status change
  let completedAt = currentTodo.completedAt;
  if (updates.completed !== undefined && updates.completed !== currentTodo.completed) {
    completedAt = updates.completed ? now : null;
  }

  const updatedTodo: Todo = {
    ...currentTodo,
    ...updates,
    completedAt,
    updatedAt: now,
  };
  todos[index] = updatedTodo;
  return updatedTodo;
}

// Delete todo
export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

// Get completion statistics for the last 7 days
export interface DailyStats {
  date: string; // YYYY-MM-DD format
  completed: number;
}

export function getLast7DaysStats(): DailyStats[] {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  // Pre-group todos by completion date for O(n) performance
  const completionsByDate = new Map<string, number>();
  
  todos.forEach((todo) => {
    if (todo.completedAt) {
      const dateStr = todo.completedAt.split('T')[0]; // YYYY-MM-DD
      completionsByDate.set(dateStr, (completionsByDate.get(dateStr) || 0) + 1);
    }
  });
  
  // Generate stats for last 7 days (including today)
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0); // Start of day
    
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const completedCount = completionsByDate.get(dateStr) || 0;
    
    stats.push({
      date: dateStr,
      completed: completedCount,
    });
  }
  
  return stats;
}
