// backend/routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

/**
 * Helper: validate that sessionId exists
 */
function requireSessionId(req, res) {
  const fromQuery = req.query.sessionId;
  const fromBody = req.body.sessionId;

  const sessionId = fromQuery || fromBody;

  if (!sessionId) {
    res.status(400).json({ message: 'sessionId is required' });
    return null;
  }

  return sessionId;
}

// GET /api/tasks?sessionId=xxx  → get tasks for this session
router.get('/', async (req, res) => {
  try {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const tasks = await Task.find({ sessionId })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks  { title, sessionId } → create new task for this session
router.post('/', async (req, res) => {
  try {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = await Task.create({ title: title.trim(), sessionId });

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/tasks/:id/toggle  { sessionId } → toggle done (only if belongs to this session)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const task = await Task.findOne({
      _id: req.params.id,
      sessionId,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isDone = !task.isDone;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id  { sessionId } → delete only if belongs to this session
router.delete('/:id', async (req, res) => {
  try {
    const sessionId = requireSessionId(req, res);
    if (!sessionId) return;

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      sessionId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
