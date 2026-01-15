#!/usr/bin/env node

/**
 * Simple WebSocket connection test for Rahoot
 * Run this after starting the server to verify WebSocket connectivity
 */

const { io } = require('socket.io-client');
const http = require('http');

async function testWebSocketConnection() {
  console.log('🧪 Testing Rahoot WebSocket Connection...\n');

  try {
    // Step 1: Test socket endpoint
    console.log('1️⃣ Testing socket endpoint...');
    
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/socket', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Request timeout')));
    });
    
    console.log(`   ✅ Socket endpoint returns: ${response.url}\n`);

    // Step 2: Test WebSocket connection
    console.log('2️⃣ Testing WebSocket connection...');
    const socket = io(response.url, {
      transports: ['websocket'],
      timeout: 5000,
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Connection timeout after 5 seconds'));
      }, 5000);

      socket.on('connect', () => {
        clearTimeout(timeout);
        console.log('   ✅ WebSocket connected successfully!');
        console.log(`   📡 Socket ID: ${socket.id}`);
        
        // Test a simple event
        socket.emit('player:join', '123456');
        
        setTimeout(() => {
          socket.disconnect();
          console.log('   ✅ WebSocket disconnected cleanly\n');
          resolve();
        }, 1000);
      });

      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      socket.on('game:errorMessage', (message) => {
        console.log(`   📨 Received game error: ${message}`);
      });

      socket.on('game:successRoom', (gameId) => {
        console.log(`   📨 Received game success: ${gameId}`);
      });
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testWebSocketConnection()
  .then(() => {
    console.log('🎉 All WebSocket tests passed!');
    console.log('✅ Your Rahoot deployment is ready for students!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ WebSocket test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure the server is running: npm start');
    console.log('   • Check if port 3000 is accessible');
    console.log('   • Verify no firewall is blocking the connection');
    console.log('   • Check server logs for errors');
    process.exit(1);
  });