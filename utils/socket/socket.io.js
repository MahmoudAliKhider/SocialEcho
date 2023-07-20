const socketIO = require("socket.io");

let io;
function initSocket(server) {
  io = socketIO(server);
  return io;
}

function getSocket() {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }
  return io;
}

module.exports = { initSocket, getSocket };
