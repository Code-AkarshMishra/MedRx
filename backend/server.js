require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const analysisRoutes = require('./src/routes/analysisRoutes');
const historyRoutes = require('./src/routes/historyRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      // Allow LAN testing when Vite is opened via Network URL
      "http://192.168.0.107:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Database Connection
connectDB();

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api', analysisRoutes); // Contains /analyze and /chat
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MedRx Backend running on port ${PORT}`));