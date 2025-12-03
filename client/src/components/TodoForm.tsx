import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAddTodo: (title: string, dueDate?: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onAddTodo(trimmedTitle, dueDate || undefined);
    setTitle('');
    setDueDate('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          className="todo-input"
          placeholder="新しいタスクを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="date-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          title="期限を設定"
        />
        <button type="submit" className="add-button" disabled={!title.trim()}>
          追加
        </button>
      </div>
    </form>
  );
}
