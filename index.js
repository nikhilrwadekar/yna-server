const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

var participantCounter = 0;

// When someone connects to the server..
io.on("connection", (socket) => {
  socket.on("chatMessage", (message) => {
    console.log(message);
    io.emit("newChatMessage", message);
  });

  // Emit to everyone but the one who just connected.. // Log in the server
  socket.broadcast.emit("broadcast", "A user joined!");
  console.log(`Someone just connected..`);

  // Increase Participant Count
  participantCounter++;
  console.log(participantCounter);

  // Broadcast the number of people in the room
  io.emit("broadcast", "Total People in the room: " + participantCounter); // emit an event to all connected sockets

  // Send only to the connected client, his/her Participant Number!
  socket.emit("welcomeMessage", {
    message: `Welcome to the server.. You are Participant #${participantCounter}!`,
  });

  // When the User leaves/exits..
  socket.on("disconnect", function () {
    // Decrease the participant count
    participantCounter--;

    // Broadcast the number of people in the room
    io.emit("broadcast", "Total People in the room: " + participantCounter); // emit an event to all connected sockets

    // Annouce someone left..
    socket.broadcast.emit("broadcast", "A user left!");

    console.log(`Someone just disconnected..`);
  });
});

server.listen(4000, () => console.log(`http://localhost:${4000}`));
