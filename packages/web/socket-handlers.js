// Socket.IO handlers for Netlify Functions
const { inviteCodeValidator } = require("@rahoot/common/validators/auth");

// Import game logic (you'll need to adapt the socket server code)
// This is a simplified version for Netlify deployment

module.exports = function setupSocketHandlers(io) {
  const games = new Map();
  
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("player:join", (inviteCode) => {
      const result = inviteCodeValidator.safeParse(inviteCode);
      
      if (result.error) {
        socket.emit("game:errorMessage", result.error.issues[0].message);
        return;
      }

      // Find game by invite code
      const game = Array.from(games.values()).find(g => g.inviteCode === inviteCode);
      
      if (!game) {
        socket.emit("game:errorMessage", "Game not found");
        return;
      }

      socket.emit("game:successRoom", game.gameId);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};