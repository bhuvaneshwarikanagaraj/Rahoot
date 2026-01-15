const { Server } = require("socket.io");

let io;

exports.handler = async (event, context) => {
  // Initialize Socket.IO server if not already done
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Import and setup game logic
    const setupSocketHandlers = require("../../socket-handlers");
    setupSocketHandlers(io);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    },
    body: JSON.stringify({ message: "Socket server running" })
  };
};