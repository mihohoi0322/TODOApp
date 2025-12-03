import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: string | null) => void;
}

export function TodoList({
  todos,
  onToggleComplete,
  onDelete,
  onUpdateDueDate,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdateDueDate={onUpdateDueDate}
        />
      ))}
    </div>
  );
}
