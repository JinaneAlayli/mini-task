// backend/routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// GET /api/tasks → get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks → create a new task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = await Task.create({ title });
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/tasks/:id/toggle → toggle done
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isDone = !task.isDone;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id → delete task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
