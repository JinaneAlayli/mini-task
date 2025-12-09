// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Mini Tasks API is running ');
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });
