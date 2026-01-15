#!/usr/bin/env node

/**
 * Build script to create production distribution
 * This script creates a complete dist/ folder with all necessary files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Rahoot Production Distribution...\n');

// Step 1: Clean existing dist
console.log('1️⃣ Cleaning existing dist folder...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist');

// Step 2: Build all packages
console.log('2️⃣ Building all packages...');
execSync('pnpm build', { stdio: 'inherit' });

// Step 3: Copy Next.js build
console.log('3️⃣ Copying Next.js build...');
execSync('cp -r packages/web/.next dist/web', { stdio: 'inherit' });

// Step 4: Copy socket server build
console.log('4️⃣ Copying socket server build...');
fs.mkdirSync('dist/socket', { recursive: true });
execSync('cp packages/socket/dist/index.cjs dist/socket/', { stdio: 'inherit' });

// Step 5: Copy static assets
console.log('5️⃣ Copying static assets...');
if (fs.existsSync('packages/web/public')) {
  execSync('cp -r packages/web/public dist/web-public', { stdio: 'inherit' });
}

// Step 6: Copy configuration files
console.log('6️⃣ Copying configuration files...');
execSync('cp -r config dist/', { stdio: 'inherit' });

// Step 7: Create package.json for dist
console.log('7️⃣ Creating package.json...');
const distPackageJson = {
  "name": "rahoot-production",
  "version": "1.0.0",
  "description": "Rahoot Spelling Quiz - Production Distribution",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.8.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

fs.writeFileSync('dist/package.json', JSON.stringify(distPackageJson, null, 2));

// Step 8: Create production server
console.log('8️⃣ Creating production server...');
const serverJs = `const express = require('express');
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
  const socketUrl = \`\${protocol}://\${host}\`;
  
  console.log(\`Socket endpoint called - returning: \${socketUrl}\`);
  res.json({ url: socketUrl });
});

// Serve config files
app.get('/api/config/:type', (req, res) => {
  const { type } = req.params;
  const configPath = path.join(__dirname, 'config', \`\${type}.json\`);
  
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
  console.log(\`User connected: \${socket.id}\`);

  socket.on('player:join', (inviteCode) => {
    if (!inviteCode || inviteCode.length !== 6) {
      socket.emit('game:errorMessage', 'Invalid invite code');
      return;
    }
    
    // Basic game logic - extend as needed
    socket.emit('game:successRoom', 'demo-game-id');
  });

  socket.on('disconnect', () => {
    console.log(\`User disconnected: \${socket.id}\`);
  });
});

// Catch all handler for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/server/app/index.html'));
});

server.listen(PORT, () => {
  console.log(\`🚀 Rahoot server running on port \${PORT}\`);
  console.log(\`📱 Access at: http://localhost:\${PORT}\`);
  console.log(\`🎮 Manager at: http://localhost:\${PORT}/manager\`);
});

module.exports = { app, server, io };`;

fs.writeFileSync('dist/server.js', serverJs);

// Step 9: Copy additional files
console.log('9️⃣ Copying additional files...');
const filesToCopy = [
  'dist/test-websocket.js',
  'dist/README.md',
  'MANUAL_DEPLOYMENT_GUIDE.md',
  'WEBSOCKET_FIX.md'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    const filename = path.basename(file);
    const destPath = file.startsWith('dist/') ? file : `dist/${filename}`;
    if (file !== destPath) {
      execSync(`cp "${file}" "${destPath}"`, { stdio: 'inherit' });
    }
  }
});

console.log('\n✅ Production distribution created successfully!');
console.log('📁 Location: ./dist/');
console.log('🚀 To deploy: cd dist && npm install && npm start');
console.log('🧪 To test: cd dist && node test-websocket.js');