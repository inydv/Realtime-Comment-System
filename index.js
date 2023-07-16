// IMPORT MODULES
const express = require("express");

// CREATE EXPRESS APP
const app = express();

// CONSTANTS
const PORT = process.env.PORT || 3000;

// SERVE STATIC FILE
app.use(express.static("public"));

// LISTEN SERVER
const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// SOCKET IO FOR REAL TIME FUNCTIONS
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(`new connection: ${socket.id}`);

  // RECIEVE EVENT
  socket.on("comment", (data) => {
    console.log(data);

    // BROADCAST TO ALL
    data.time = Date();

    // CREATE EVENT (TO SCRIPT)
    socket.broadcast.emit("comment", data);
  });
});
