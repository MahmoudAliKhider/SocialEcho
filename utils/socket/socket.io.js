const socketIO = require("socket.io");

let io;

// Function to initialize the Socket.io instance
function initSocket(server) {
  io = socketIO(server);
  return io;
}

// Function to get the Socket.io instance
function getSocket() {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
}

module.exports = { initSocket, getSocket };
