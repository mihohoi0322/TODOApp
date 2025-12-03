import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Todo } from './types/Todo';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './utils/api';
import { Navigation } from './components/Navigation';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { CompletedTodayView } from './components/CompletedTodayView';
import { ConfirmDialog } from './components/ConfirmDialog';

type FilterType = 'inbox' | 'today' | 'upcoming' | 'completedToday';

interface ConfirmDialogState {
  isOpen: boolean;
  todoId: string | null;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('inbox');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    todoId: null,
  });

  // Fetch todos when filter changes
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos(currentFilter);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの取得に失敗しました🥲🥲🥲');
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Add new todo
  const handleAddTodo = async (title: string, dueDate?: string) => {
    try {
      setError(null);
      await createTodo(title, dueDate);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの追加に失敗しました');
    }
  };

  // Toggle todo completion
  const handleToggleComplete = async (id: string) => {
    try {
      setError(null);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        await updateTodo(id, { completed: !todo.completed });
        await loadTodos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの更新に失敗しました');
    }
  };

  // Show delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setConfirmDialog({ isOpen: true, todoId: id });
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (confirmDialog.todoId) {
      try {
        setError(null);
        await deleteTodo(confirmDialog.todoId);
        await loadTodos();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'タスクの削除に失敗しました');
      }
    }
    setConfirmDialog({ isOpen: false, todoId: null });
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, todoId: null });
  };

  // Update due date
  const handleUpdateDueDate = async (id: string, dueDate: string | null) => {
    try {
      setError(null);
      await updateTodo(id, { dueDate });
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : '期限の更新に失敗しました');
    }
  };

  // Change filter
  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter as FilterType);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO アプリ</h1>
      </header>

      <Navigation
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />

      <main className="app-main">
        {currentFilter !== 'completedToday' && (
          <TodoForm onAddTodo={handleAddTodo} />
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : currentFilter === 'completedToday' ? (
          <CompletedTodayView
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteClick}
            onUpdateDueDate={handleUpdateDueDate}
          />
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteClick}
            onUpdateDueDate={handleUpdateDueDate}
          />
        )}
      </main>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message="このタスクを削除してもよろしいですか？"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default App;
