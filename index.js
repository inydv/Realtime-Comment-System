// IMPORT MODULES
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

// CREATE EXPRESS APP
const app = express();

// CONSTANTS
const PORT = process.env.PORT || 3000;

// USE JSON
app.use(express.json());

// SERVE STATIC FILE
app.use(express.static("public"));

// MONGODB DATABASE
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connected...");
});

// ROUTES
const Comment = require("./models/comment");

app.post("/api/comments", (req, res) => {
  const comment = new Comment({
    username: req.body.username,
    comment: req.body.comment,
  });

  comment.save().then((response) => {
    res.send(response);
  });
});

app.get("/api/comments", (req, res) => {
  Comment.find().then((comments) => {
    res.send(comments);
  });
});

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
    data.time = Date();

    // CREATE EVENT (TO SCRIPT)
    socket.broadcast.emit("comment", data);
  });

  // RECIEVE EVENT
  socket.on("typing", (data) => {
    // CREATE EVENT (TO SCRIPT)
    socket.broadcast.emit("typing", data);
  });
});
