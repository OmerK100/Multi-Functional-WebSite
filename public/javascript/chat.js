/**
 * Client's chat side, all functions such as messaging, room creatin/joining/leaving, etc..
 */



const socket = io("ws://localhost:4000");

/*const globalButton = document.getElementById("global");
const privateButton = document.getElementById("private");
const submit = document.getElementById("submit");
const inputUser = document.getElementById("username");
const inputText = document.getElementById("text");

var globalChat = true;
inputUser.style.display = "none";

globalButton.addEventListener("click", () => {
  globalChat = true;
  inputUser.style.display = "none";
});

privateButton.addEventListener("click", () => {
  globalChat = false;
  inputUser.style.display = "block";
});

submit.addEventListener("click", () => {
  if (globalChat === true) {
    const text = inputText.value;
    socket.emit("message", {text: text});
    const li = document.createElement("li");
    li.innerText = "You: " + text;
    document.getElementById("messages")[0].appendChild(li);


  } else {
    console.log(1111);
    const text = inputText.value;
    const user = inputUser.value;
    var obj = {text: text, username: user};
    socket.emit("private message", obj);
  }
});

socket.addEventListener("message", (data) => {
  if (globalChat === true) {
    console.log(111);
    console.log(data);
    const li = document.createElement("li");
    li.innerText = data;
    document.getElementById("messages").appendChild(li);
  } else {
    console.log(111);
    console.log(data);
    const li = document.createElement("li");
    li.innerText = data;
    document.getElementById("messages").appendChild(li);
  }
});

socket.addEventListener("private message", (data) => {
  if (globalChat === true) {
    console.log(111);
    console.log(data);
    const li = document.createElement("li");
    li.innerText = data;
    document.getElementById("messages").appendChild(li);
  } else {
    console.log(111);
    console.log(data);
    const li = document.createElement("li");
    li.innerText = data;
    document.getElementById("messages").appendChild(li);
  }
});


socket.addEventListener("connection", () => {
  const li = document.createElement("li");
  li.innerText = "You";
  li.className += " users"
  document.getElementById("user_list").appendChild(li);
  console.log("connected!");
});

socket.addEventListener("new user", (data) => {
  
  const li = document.createElement("li");
  li.innerText = data
  li.className += " users"
  document.getElementById("user_list").appendChild(li);
});

socket.addEventListener("previous users", (data) => {
  for (var i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    li.innerText = data[i];
    li.className += " users"
    document.getElementById("user_list").appendChild(li);
  }
});

socket.addEventListener("disconnect user", (data) => {
  
  console.log(data);
  const users = document.getElementsByClassName("users");
  for (var i = 0; i < users.length; i++) {
    console.log(users[i].innerText)
    if (users[i].innerText === data) {
      console.log("ccccc")
      users[i].remove();
    }
  }
});
*/
var whichRoom = null;
var whichPrivate = null;
var privateMessage = null;

const usernameInput = document.getElementById("username");
const privateInput = document.getElementById("private-input");
const privateButton = document.getElementById("private-button");

privateButton.addEventListener("click", () => {
  socket.emit("private initiate", {receiver: usernameInput.value, message: privateInput.value}); // Request private chat
  privateMessage = privateInput.value;
});

socket.addEventListener("private initiate", (data) => {
  const {from, message, roomId} = data;
  const proceed = confirm(from + " would like to start a private chat with you, proceed?");
  if (proceed === true) {
    if (whichRoom !== null) {
      leaveRoomButton.click();
    }
    goPrivate(from, message);
    whichRoom = roomId;
    socket.emit("join private", {from: from});
  } else {
    socket.emit("fail private", {from: from});
  }
});

socket.addEventListener("join private", (data) => { // Join a private chat
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "block";
  whichRoom = data.roomId;
  const li = document.createElement("li");
  li.innerText = "You: " + privateMessage;
  li.className += " messages";
  document.getElementById("messages").appendChild(li);
  document.getElementById("your-chat").innerText = "Private chat with " + data.receiver;
});

socket.addEventListener("fail private", (data) => {
  alert(data);
});

const inputMessagePrivate = document.getElementById("input-message-private");
const submitMessagePrivate = document.getElementById("submit-message-private");
const leavePrivateButton = document.getElementById("leave-private");

function goPrivate(from, message) {
  whichPrivate = from;
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "block";
  document.getElementById("your-chat").innerText = "Private chat with " + from;
  const li = document.createElement("li");
  li.innerText = from + ": " + message;
  li.className += " messages";
  document.getElementById("messages").appendChild(li);
}

const globalButton = document.getElementById("global"); // Join a global chat

globalButton.addEventListener("click", (event) => {
  socket.emit("join room", {roomName: event.target.innerText});
  document.getElementById("main1").style.display = "none";
  document.getElementById("main2").style.display = "block";
  whichRoom = event.target.innerText;
  document.getElementById("your-chat").innerText = "Joined room: " + whichRoom;
  const li = document.createElement("li");
  li.innerText = "You have joind room " + whichRoom + " successfully!";
  li.className += " messages join-notify";
  document.getElementById("messages").appendChild(li);
});

const roomInput = document.getElementById("room-input");
const createButton = document.getElementById("create-button");

const leaveRoomButton = document.getElementById("leave-room");
const submitMessageRoom = document.getElementById("submit-message-room");
const inputMessageRoom = document.getElementById("input-message-room")

document.getElementById("main1").style.display = "block";
document.getElementById("main2").style.display = "none";

createButton.addEventListener("click", () => {
  const roomName = roomInput.value;
  socket.emit("create room", {roomName: roomName});
});

socket.addEventListener("new room", (data) => { // Create a new room
  const button = document.createElement("button");
  button.innerText = data;
  button.addEventListener("click", (event) => {
    socket.emit("join room", {roomName: event.target.innerText});
    document.getElementById("main1").style.display = "none";
    document.getElementById("main2").style.display = "block";
    whichRoom = event.target.innerText;
    document.getElementById("your-chat").innerText = "Joined room: " + whichRoom;
    const li = document.createElement("li");
    li.innerText = "You have joind room " + whichRoom + " successfully!";
    li.className += " messages join-notify";
    document.getElementById("messages").appendChild(li);
  });
  button.className += " rooms"
  document.getElementById("div-rooms").appendChild(button);
});

leaveRoomButton.addEventListener("click", () => {
  socket.emit("leave room", {roomName: whichRoom});
  document.getElementById("main1").style.display = "block";
  document.getElementById("main2").style.display = "none";
  whichRoom = null;
  document.getElementById("your-chat").innerText = "You are not in a chat currently!";
  /*const messages = document.getElementsByClassName("messages");                                 // something sus here with deleting li 
  console.log(messages);*/
  /*for (var i = 0; i < messages.length; i++) {
    console.log(messages[i]);
    messages[i].remove();
  }*/
  document.getElementById("messages").innerHTML = "";
});

submitMessageRoom.addEventListener("click", () => {
  const li = document.createElement("li");
  li.innerText = "You: " + inputMessageRoom.value;
  li.className += " messages";
  document.getElementById("messages").appendChild(li);
  socket.emit("message room", {roomName: whichRoom, message: inputMessageRoom.value});
});

socket.addEventListener("message room", (data) => {
  const {text, notifyJoin} = data;
  if (notifyJoin) {
    const li = document.createElement("li");
    li.innerText = text;
    li.className += " messages join-notify";
    document.getElementById("messages").appendChild(li);
  } else {
    const li = document.createElement("li");
    li.innerText = text;
    li.className += " messages";
    const messages = document.getElementsByClassName("messages");
    document.getElementById("messages").appendChild(li);
  }
});

socket.addEventListener("leave room", (data) => {
  const li = document.createElement("li");
  li.innerText = data;
  li.className += " messages leave-notify";
  document.getElementById("messages").appendChild(li);
});

socket.addEventListener("new user", (data) => {
  const li = document.createElement("li");
  li.innerText = data
  li.className += " users"
  document.getElementById("user_list").appendChild(li);
});

socket.addEventListener("previous users", (data) => {
  for (var i = 0; i < data.length; i++) {
    console.log(1);
    const li = document.createElement("li");
    li.innerText = data[i];
    li.className += " users"
    document.getElementById("user_list").appendChild(li);
  }
});

socket.addEventListener("disconnect user", (data) => {
  const users = document.getElementsByClassName("users");
  for (var i = 0; i < users.length; i++) {
    if (users[i].innerText === data) {
      users[i].remove();
    }
  }
});

socket.addEventListener("connection", () => {
  const li = document.createElement("li");
  li.innerText = "You";
  li.className += " users"
  document.getElementById("user_list").appendChild(li);
  console.log("connected!");
});