# 🚀 Manual Deployment Guide - Step by Step

## 📋 **Prerequisites**

Before starting, make sure you have:
- **Node.js 18+** installed on your server
- **Terminal/Command Prompt** access
- **Network access** for students to connect

## 🔧 **Step-by-Step Manual Deployment**

### **Step 1: Prepare the Server**

**Check Node.js version:**
```bash
node --version
# Should show v18.0.0 or higher
```

**If Node.js is not installed:**
- **Windows**: Download from [nodejs.org](https://nodejs.org)
- **macOS**: `brew install node` or download from nodejs.org
- **Linux**: `sudo apt install nodejs npm` or `sudo yum install nodejs npm`

### **Step 2: Copy Distribution Files**

**Option A: Copy the dist folder to your server**
```bash
# If deploying on the same machine
cd dist

# If deploying on a different server, copy the entire dist/ folder
scp -r dist/ user@server:/path/to/deployment/
```

**Option B: Download/Transfer the dist folder**
- Copy the entire `dist/` folder to your deployment location
- Ensure all files and subdirectories are included

### **Step 3: Install Dependencies**

**Navigate to the dist folder:**
```bash
cd dist
```

**Install required packages:**
```bash
npm install
```

**Expected output:**
```
added 150 packages, and audited 151 packages in 30s
found 0 vulnerabilities
```

### **Step 4: Configure the Application**

**Check configuration files:**
```bash
# Verify game config exists
cat config/game.json
# Should show: {"managerPassword": "PASSWORD"}

# Check quiz files
ls config/quizz/
# Should show: spelling.json  advanced-spelling.json
```

**Optional: Change manager password**
```bash
# Edit the config file
nano config/game.json
# or
vim config/game.json

# Change "PASSWORD" to your desired password
{
  "managerPassword": "YOUR_NEW_PASSWORD"
}
```

### **Step 5: Start the Server**

**Start the application:**
```bash
npm start
```

**For production deployment with custom domain:**
```bash
# Set environment variable for socket URL (optional)
export SOCKET_URL="https://your-domain.com"
npm start
```

**Expected output:**
```
🚀 Rahoot server running on port 3000
📱 Access at: http://localhost:3000
🎮 Manager at: http://localhost:3000/manager
```

**If you see this, the server is running successfully!**

### **Step 6: Test the Deployment**

**Test WebSocket Connection (Recommended):**
```bash
# Run the WebSocket connection test
node test-websocket.js
```

**Expected output:**
```
🧪 Testing Rahoot WebSocket Connection...

1️⃣ Testing socket endpoint...
   ✅ Socket endpoint returns: http://localhost:3000

2️⃣ Testing WebSocket connection...
   ✅ WebSocket connected successfully!
   📡 Socket ID: abc123
   📨 Received game error: Invalid invite code
   ✅ WebSocket disconnected cleanly

🎉 All WebSocket tests passed!
✅ Your Rahoot deployment is ready for students!
```

**Manual Browser Testing:**

**Open your browser and test:**

1. **Manager Interface:**
   - Go to: `http://localhost:3000/manager`
   - Enter password: `PASSWORD` (or your custom password)
   - You should see the quiz selection screen

2. **Player Interface:**
   - Go to: `http://localhost:3000`
   - You should see the PIN entry screen

3. **Create a test game:**
   - In manager, select "Spelling Quiz"
   - Note the 6-digit PIN
   - In another browser tab, enter the PIN
   - Test the spelling interface

### **Step 7: Network Access Setup**

**Find your server's IP address:**

**On Windows:**
```cmd
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**On macOS/Linux:**
```bash
ifconfig
# or
ip addr show
# Look for inet address (e.g., 192.168.1.100)
```

**Test network access:**
- From another device on the same network
- Go to: `http://[YOUR-IP]:3000`
- Example: `http://192.168.1.100:3000`

### **Step 8: Firewall Configuration**

**Allow port 3000 through firewall:**

**Windows:**
```cmd
# Run as Administrator
netsh advfirewall firewall add rule name="Rahoot" dir=in action=allow protocol=TCP localport=3000
```

**macOS:**
```bash
# Usually no action needed, but if blocked:
sudo pfctl -f /etc/pf.conf
```

**Linux (Ubuntu/Debian):**
```bash
sudo ufw allow 3000
sudo ufw reload
```

**Linux (CentOS/RHEL):**
```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## 🎯 **Verification Checklist**

After deployment, verify these work:

### **✅ Server Health Check**
- [ ] Server starts without errors
- [ ] Port 3000 is accessible
- [ ] No error messages in console

### **✅ Manager Interface**
- [ ] Can access `/manager` page
- [ ] Password authentication works
- [ ] Can see quiz selection
- [ ] Can create games and get PINs

### **✅ Player Interface**
- [ ] Can access main page
- [ ] PIN entry works
- [ ] Username entry works
- [ ] Virtual keyboard responds
- [ ] Audio pronunciation works
- [ ] WebSocket connection successful (no console errors)

### **✅ WebSocket Connection**
- [ ] `/socket` endpoint returns correct URL
- [ ] No "WebSocket connection failed" errors in browser console
- [ ] Real-time game updates work properly

### **✅ Network Access**
- [ ] Other devices can connect via IP
- [ ] Mobile phones can access the game
- [ ] Multiple players can join simultaneously

## 🔧 **Troubleshooting**

### **Server Won't Start**

**Error: "Cannot find module"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Error: "Port 3000 already in use"**
```bash
# Solution: Kill existing process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

**Error: "Permission denied"**
```bash
# Solution: Run with appropriate permissions
sudo npm start
# or change port to non-privileged port (>1024)
PORT=8080 npm start
```

### **Network Access Issues**

### **WebSocket Connection Issues**

**Error: "WebSocket connection to 'ws://localhost:3001' failed"**
```bash
# This means the app is trying to connect to the wrong socket URL
# Solution: The server.js has been updated to serve sockets on the same port

# Check if the socket endpoint returns correct URL:
curl http://localhost:3000/socket
# Should return: {"url":"http://localhost:3000"}

# If still having issues, set environment variable:
export SOCKET_URL="http://localhost:3000"
npm start
```

**Students can't connect:**
1. **Check firewall** - Allow port 3000
2. **Verify IP address** - Use `ipconfig`/`ifconfig`
3. **Test locally first** - Ensure server works on localhost
4. **Check network** - Ensure devices are on same WiFi

**Audio not working:**
1. **Check browser permissions** - Allow audio
2. **Try different browser** - Chrome/Safari work best
3. **Check internet connection** - TTS needs internet

### **Performance Issues**

**Slow response:**
```bash
# Check server resources
top
# or
htop

# If low memory, restart server
npm start
```

**Multiple games slow:**
- Each game uses memory
- Monitor with `top` command
- Restart server if needed

## 🌐 **Production Deployment Options**

### **Option 1: Local Network (Classroom)**
```bash
# Perfect for classroom use
# Students connect via: http://192.168.1.100:3000
cd dist
npm start
```

### **Option 2: Cloud Server (Remote Learning)**
```bash
# Deploy on cloud server (AWS, DigitalOcean, etc.)
# Students connect via: http://your-domain.com:3000
cd dist
npm install
npm start
```

### **Option 3: Process Manager (Production)**
```bash
# Install PM2 for production
npm install -g pm2

# Start with PM2
pm2 start server.js --name rahoot

# Auto-restart on reboot
pm2 startup
pm2 save
```

### **Option 4: Custom Port**
```bash
# Run on different port
PORT=8080 npm start
# Access via: http://localhost:8080
```

## 📱 **Student Access Instructions**

**Give these instructions to students:**

1. **Connect to WiFi** - Same network as teacher's computer
2. **Open browser** - Chrome, Safari, Firefox, or Edge
3. **Enter URL** - `http://[TEACHER-IP]:3000`
4. **Enter PIN** - 6-digit code from teacher
5. **Enter username** - Your name (4-20 characters)
6. **Play game** - Use virtual keyboard to spell words

**Example student instructions:**
```
📱 Join the Spelling Quiz Game!

1. Connect to classroom WiFi
2. Open your phone's browser
3. Go to: http://192.168.1.100:3000
4. Enter PIN: 123456
5. Enter your name
6. Start spelling!
```

## 🎮 **Game Management**

### **Starting a Game Session**
1. **Start server**: `npm start`
2. **Open manager**: `http://localhost:3000/manager`
3. **Login**: Enter password
4. **Select quiz**: Choose spelling or advanced
5. **Share PIN**: Give 6-digit code to students
6. **Monitor**: Watch real-time progress

### **Managing Multiple Games**
- Each game gets a unique PIN
- Multiple games can run simultaneously
- Monitor all games from manager dashboard

### **Stopping the Server**
```bash
# Press Ctrl+C in terminal
# or
pkill -f "node server.js"
```

---

## 🎉 **You're Ready!**

Following these steps will get your Rahoot spelling quiz game running manually. The process is:

1. **Install Node.js** ✅
2. **Copy dist folder** ✅  
3. **Run `npm install`** ✅
4. **Run `npm start`** ✅
5. **Test locally** ✅
6. **Configure network access** ✅
7. **Share with students** ✅

**Your spelling quiz game is now live and ready for educational use!** 🎯📚