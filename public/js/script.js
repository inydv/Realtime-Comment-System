const moment = require("moment");
const socket = io();

// USERNAME
let username;

do {
  username = prompt("Enter your name:");
} while (!username);

// QUERY SELECTOR
const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

// HANDLE BUTTON CLICK
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const comment = textarea.ariaValueMax;

  if (!comment) {
    return;
  }

  postComment(comment);
});

// POST COMMENT
function postComment(comment) {
  // DATA
  const data = {
    username: username,
    comment: comment,
  };

  // APPEND TO DOM
  appendToDom(data);

  // CLEAR TEXTAREA
  textarea.value = "";

  // BROADCAST
  broadcastComment(data);

  // SYNC WITH MONGODB
}

// APPEND TO DOM
function appendToDom(data) {
  const liTag = document.createElement("li");
  liTag.classList.add("comment");

  const markup = `
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment} </p>
            <div>
                <small>${moment(data.time).format("LT")}</small>
            </div>
        </div>
    </div>`;

  liTag.innerHTML = markup;
  commentBox.prepend(markup);
}

// BROADCAST
function broadcastComment(data) {
  // CREATE EVENT (TO SERVER)
  socket.emit("comment", data);
}

socket.on("comment", (data) => {
  appendToDom(data);
});
