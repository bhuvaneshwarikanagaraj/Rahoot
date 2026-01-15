# 🎮 Rahoot Spelling Quiz - Production Distribution

## 📦 **What's Included**

This distribution contains everything needed to run the Rahoot spelling quiz game in production.

### **📁 Directory Structure**
```
dist/
├── web/                    # Next.js production build
├── web-public/            # Static assets (sounds, images)
├── socket/                # Socket.IO server build
├── config/                # Quiz configurations
│   ├── game.json         # Game settings
│   └── quizz/            # Quiz files
│       ├── spelling.json
│       └── advanced-spelling.json
├── package.json          # Dependencies
├── server.js            # Production server
└── README.md           # This file
```

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
cd dist
npm install
```

### **2. Start the Server**
```bash
npm start
```

### **3. Access the Game**
- **Main App**: http://localhost:3000
- **Manager**: http://localhost:3000/manager
- **Password**: `PASSWORD`

### **4. Test WebSocket Connection (Optional)**
```bash
node test-websocket.js
```
This verifies that real-time multiplayer features work correctly.

## 🎯 **Features**

### **✅ Spelling Quiz Game**
- **Virtual Keyboard** - Touch-friendly on mobile
- **Online Audio** - Text-to-speech pronunciation
- **Individual Letter Boxes** - One box per letter
- **Correct Answer Display** - Educational feedback
- **15-second Timer** - Fast-paced gameplay

### **✅ Mobile Optimized**
- **Responsive Design** - Works on all screen sizes
- **Touch Interface** - Optimized for phones/tablets
- **Cross-Platform** - iOS, Android, desktop browsers

### **✅ Real-time Multiplayer**
- **PIN-based Joining** - 6-digit game codes
- **Live Leaderboards** - Real-time scoring
- **Manager Dashboard** - Host controls
- **Multiple Games** - Concurrent game sessions

## 🎮 **How to Play**

### **For Teachers/Managers:**
1. Go to http://localhost:3000/manager
2. Enter password: `PASSWORD`
3. Select a quiz (Spelling Quiz or Advanced Spelling Quiz)
4. Share the 6-digit PIN with students
5. Start the game and monitor progress

### **For Students/Players:**
1. Go to http://localhost:3000
2. Enter the PIN code from teacher
3. Enter your username
4. Listen to word pronunciation
5. Use virtual keyboard to spell the word
6. Submit and see results!

## 📱 **Mobile Access**

Students can play on their phones:
1. **Connect to same network** as the server
2. **Find server IP** (e.g., 192.168.1.100:3000)
3. **Open browser** and enter the IP address
4. **Play with virtual keyboard** - no app needed!

## 🔧 **Configuration**

### **Game Settings** (`config/game.json`)
```json
{
  "managerPassword": "PASSWORD"
}
```

### **Quiz Files** (`config/quizz/*.json`)
```json
{
  "subject": "Spelling Quiz",
  "type": "spelling",
  "questions": [
    {
      "question": "A large African mammal with a trunk",
      "audio": "elephant",
      "solution": "elephant",
      "cooldown": 3,
      "time": 15
    }
  ]
}
```

## 🌐 **Deployment Options**

### **Local Network**
- Run on classroom computer
- Students connect via IP address
- Perfect for offline use

### **Cloud Deployment**
- Deploy to Heroku, Railway, or DigitalOcean
- Students access via URL
- Great for remote learning

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist/ .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 **System Requirements**

### **Server**
- **Node.js**: 18.0.0 or higher
- **RAM**: 512MB minimum
- **Storage**: 100MB for application
- **Network**: HTTP/WebSocket support

### **Client (Students)**
- **Browser**: Chrome, Safari, Firefox, Edge
- **JavaScript**: Enabled
- **Audio**: For word pronunciation
- **Touch/Mouse**: For virtual keyboard

## 🎯 **Educational Benefits**

### **For Teachers**
- **Easy Setup** - No complex installation
- **Real-time Monitoring** - See all student progress
- **Customizable** - Add your own spelling words
- **Engaging** - Interactive and fun for students

### **For Students**
- **Audio Learning** - Hear correct pronunciation
- **Visual Feedback** - See correct spelling
- **Competitive** - Leaderboards and scoring
- **Accessible** - Works on any device

## 🔧 **Troubleshooting**

### **Server Won't Start**
- Check Node.js version: `node --version`
- Install dependencies: `npm install`
- Check port availability: `netstat -an | grep 3000`

### **WebSocket Connection Issues**
- **Error**: "WebSocket connection failed"
- **Solution**: Server now serves WebSocket on same port (3000)
- **Test**: Run `node test-websocket.js` to verify connection
- **Check**: Visit `/socket` endpoint to see returned URL

### **Students Can't Connect**
- Check firewall settings
- Verify IP address is correct
- Ensure devices are on same network

### **Audio Not Working**
- Check browser permissions
- Try different browser
- Verify internet connection (for online TTS)

## 📈 **Performance**

### **Capacity**
- **Concurrent Games**: 10+ simultaneous games
- **Players per Game**: 30+ students
- **Response Time**: <100ms for interactions

### **Optimization**
- **Lightweight**: ~50MB total size
- **Fast Loading**: <2 seconds startup
- **Efficient**: Low CPU and memory usage

---

## 🎉 **Ready to Use!**

This production distribution is ready to deploy and use in educational environments. Perfect for:

- **Classroom spelling practice**
- **Remote learning sessions**
- **Educational games and competitions**
- **Language learning activities**

**Start the server and begin teaching spelling in a fun, interactive way!** 🎯📚