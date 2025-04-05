const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server Error: Failed to retrieve tasks',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Task text is required' });
    }

    const task = new Task({
      text: text.trim(),
      user: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ 
      error: 'Invalid Request: Failed to create task',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    if (!text && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updates = {};
    if (text && text.trim().length > 0) updates.text = text.trim();
    if (typeof completed === 'boolean') updates.completed = completed;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (err) {
    const statusCode = err.name === 'CastError' ? 400 : 500;
    res.status(statusCode).json({ 
      error: 'Failed to update task',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ 
      message: 'Task deleted successfully',
      deletedTask: task 
    });
  } catch (err) {
    const statusCode = err.name === 'CastError' ? 400 : 500;
    res.status(statusCode).json({ 
      error: 'Failed to delete task',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};