import { Todo } from '../types/Todo';
import { formatDate, isPastDue, isToday } from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: string | null) => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onUpdateDueDate,
}: TodoItemProps) {
  const getDueDateClass = () => {
    if (!todo.dueDate) return '';
    if (isPastDue(todo.dueDate)) return 'past-due';
    if (isToday(todo.dueDate)) return 'due-today';
    return '';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value || null;
    onUpdateDueDate(todo.id, newDate);
  };

  const handleClearDate = () => {
    onUpdateDueDate(todo.id, null);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          title="完了状態を切り替え"
        />
        <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </span>
      </div>
      
      <div className="todo-actions">
        <div className={`todo-due-date ${getDueDateClass()}`}>
          {todo.dueDate && (
            <>
              <span className="date-display">{formatDate(todo.dueDate)}</span>
              <button
                type="button"
                className="clear-date-button"
                onClick={handleClearDate}
                title="期限をクリア"
              >
                ✕
              </button>
            </>
          )}
          <input
            type="date"
            className="date-picker"
            value={todo.dueDate ? todo.dueDate.split('T')[0] : ''}
            onChange={handleDateChange}
            title="期限を設定"
          />
        </div>
        
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(todo.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
}
