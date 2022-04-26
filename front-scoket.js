const { Server } = require("socket.io");

const appendMessage = (content) => {
  const item = document.getElementById("messages");
  let hrs = Math.trunc(content / 3600);
  let min = ("0" + Math.trunc((content % 3600) / 60)).slice(-2);
  let sec = ("0" + Math.trunc(content % 60)).slice(-2);
  item.innerHTML = `${hrs}:${min}:${sec}`;
};

const socket = Server({});
socket.on("down", (reason) => {
  appendMessage(`${reason}`);
});

socket.on("finish", (reason) => {
  document.getElementById("messages").innerHTML = "ACABOU!!!";
});
