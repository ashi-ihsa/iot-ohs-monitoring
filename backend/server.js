const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this demo
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());

// Simple hardcoded database for demo
const USERS = {
  'admin': 'admin123'
};

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USERS[username] && USERS[username] === password) {
    // In a real app, generate a JWT here
    res.json({ success: true, token: 'dummy-token-12345', message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Event from MQTT Worker
  socket.on('device-data', (data) => {
    console.log('Received from MQTT worker:', data);
    // Broadcast to all connected clients (Frontend)
    io.emit('device-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
