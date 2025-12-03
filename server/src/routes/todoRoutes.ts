import { Router, Request, Response } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getLast7DaysStats,
} from '../services/todoService.js';

const router = Router();

// GET /api/todos/stats/last7days - Get completion statistics for last 7 days
router.get('/stats/last7days', (_req: Request, res: Response) => {
  try {
    const stats = getLast7DaysStats();
    res.json({ stats });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

// GET /api/todos - Get all todos with optional filter
router.get('/', (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string | undefined;
    const todos = getAllTodos(filter);
    res.json({ todos });
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

// POST /api/todos - Create new todo
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, dueDate } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'Title is required', status: 400 });
      return;
    }

    const newTodo = createTodo({
      title: title.trim(),
      dueDate: dueDate || undefined,
    });

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

// PUT /api/todos/:id - Update todo
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed, dueDate } = req.body;

    // Check if todo exists
    const existingTodo = getTodoById(id);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found', status: 404 });
      return;
    }

    // Validation
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({ error: 'Title cannot be empty', status: 400 });
      return;
    }

    const updates: { title?: string; completed?: boolean; dueDate?: string | null } = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    const updatedTodo = updateTodo(id, updates);
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if todo exists
    const existingTodo = getTodoById(id);
    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found', status: 404 });
      return;
    }

    deleteTodo(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error', status: 500 });
  }
});

export default router;
