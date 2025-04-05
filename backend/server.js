const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware setup
app.use(express.json()); // parse JSON request bodies
app.use(cors()); // enable CORS for all origins (in production, restrict as needed)

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tododb';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Setup routes
app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

// Simple route for health check or root
app.get('/', (req, res) => {
  res.send('To-Do App API is running');
});

// Global error handler (optional)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error' });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app; // export for potential testing
