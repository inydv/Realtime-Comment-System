// LIBRARY
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
const typingDiv = document.querySelector(".typing");

// HANDLE BUTTON CLICK
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const comment = textarea.value;

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
  syncWithDB();
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
  commentBox.appendChild(markup);
}

// BROADCAST
function broadcastComment(data) {
  // CREATE EVENT (TO SERVER)
  socket.emit("comment", data);
}

// RECIEVE EVENT
socket.on("comment", (data) => {
  appendToDom(data);
});

// EVENT LISTENER ON TEXTAREA
textarea.addEventListener("keyup", (e) => {
  // CREATE EVENT (TO SERVER)
  socket.emit("typing", { username });
});

let timerId = null;

// RECIEVE EVENT
socket.on("typing", (data) => {
  typingDiv.innerText = `${data.username} is typing...`;

  // DEBOUNCE FUNCTION
  debounce(function () {
    typingDiv.innerText = "";
  }, 1000);
});

// DEBOUNCE FUNCTION
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    func();
  }, timer);
}

// SYNC WITH MONGODB
function syncWithDB(data) {
  fetch("/api/comments", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
}

// FETCH COMMENTS FROM DB ON WINOW LOAD
function fetchComments() {
  fetch("/api/comments")
    .then((res) => res.json())
    .then((result) => {
      result?.forEach((comment) => {
        comment.time = comment.createdAt;
        appendToDom(comment);
      });
    });
}

window.onload = fetchComments();
