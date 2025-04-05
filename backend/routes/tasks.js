const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Use auth middleware for all /api/tasks routes
router.use(auth);

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { title, completed } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const task = new Task({ title: title.trim(), completed: !!completed, user: userId });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update a task (title or completed status)
router.put('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const { title, completed } = req.body;
    // Build update object
    const updates = {};
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ message: 'Task title cannot be empty' });
      }
      updates.title = title.trim();
    }
    if (completed !== undefined) {
      updates.completed = completed;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId }, 
      { $set: updates }, 
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    // If CastError, the taskId was invalid format
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error("Error deleting task:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
