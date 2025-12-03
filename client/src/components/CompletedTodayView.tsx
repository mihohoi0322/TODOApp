import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface CompletedTodayViewProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: string | null) => void;
}

function getCelebrationMessage(count: number): { message: string; emoji: string } {
  if (count === 0) {
    return {
      emoji: '📝',
      message: '今日はまだタスクを完了していません',
    };
  }
  if (count <= 2) {
    return {
      emoji: '🎉',
      message: `今日 ${count} 件のタスクを完了しました！`,
    };
  }
  if (count <= 4) {
    return {
      emoji: '⭐',
      message: `今日 ${count} 件のタスクを完了しました！いい調子！`,
    };
  }
  return {
    emoji: '🏆',
    message: `今日 ${count} 件のタスクを完了しました！素晴らしい！`,
  };
}

export function CompletedTodayView({
  todos,
  onToggleComplete,
  onDelete,
  onUpdateDueDate,
}: CompletedTodayViewProps) {
  const { message, emoji } = getCelebrationMessage(todos.length);

  return (
    <div className="completed-today-view">
      <div className={`celebration-banner ${todos.length === 0 ? 'empty' : ''}`}>
        <span className="celebration-emoji">{emoji}</span>
        <span className="celebration-message">{message}</span>
      </div>

      {todos.length > 0 ? (
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
      ) : (
        <div className="empty-state">
          <p>タスクを完了して、今日の成果を確認しましょう！</p>
        </div>
      )}
    </div>
  );
}
