const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files from Next.js build
app.use(express.static(path.join(__dirname, 'web')));
app.use('/static', express.static(path.join(__dirname, 'web-public')));

// Socket endpoint - returns the same URL as the web server
app.get('/socket', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || (req.connection.encrypted ? 'https' : 'http');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const socketUrl = `${protocol}://${host}`;
  
  console.log(`Socket endpoint called - returning: ${socketUrl}`);
  res.json({ url: socketUrl });
});

// Serve config files
app.get('/api/config/:type', (req, res) => {
  const { type } = req.params;
  const configPath = path.join(__dirname, 'config', `${type}.json`);
  
  if (fs.existsSync(configPath)) {
    res.json(JSON.parse(fs.readFileSync(configPath, 'utf8')));
  } else {
    res.status(404).json({ error: 'Config not found' });
  }
});

// Serve quiz files
app.get('/api/quizz', (req, res) => {
  const quizzDir = path.join(__dirname, 'config/quizz');
  const files = fs.readdirSync(quizzDir).filter(file => file.endsWith('.json'));
  
  const quizzes = files.map(file => {
    const data = JSON.parse(fs.readFileSync(path.join(quizzDir, file), 'utf8'));
    return {
      id: file.replace('.json', ''),
      ...data
    };
  });
  
  res.json(quizzes);
});

// Socket.IO handlers (simplified version)
const games = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('player:join', (inviteCode) => {
    if (!inviteCode || inviteCode.length !== 6) {
      socket.emit('game:errorMessage', 'Invalid invite code');
      return;
    }
    
    // Basic game logic - extend as needed
    socket.emit('game:successRoom', 'demo-game-id');
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Catch all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/server/app/index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 Rahoot server running on port ${PORT}`);
  console.log(`📱 Access at: http://localhost:${PORT}`);
  console.log(`🎮 Manager at: http://localhost:${PORT}/manager`);
});

module.exports = { app, server, io };