import { readFileSync } from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import tmi from "tmi.js";

const opts = {
  identity: {
    username: "8p1y7t6w4nycbxiq3l8hu34zwifmi8",
    password: "oauth:7kfsqadugeg519jiciorg3li9ub0v9"
  },
  channels: ["fabiob_rosa"]
};

const client = new tmi.client(opts);

client.connect();

const httpServer = createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(200);
    res.end("Not found");
    return;
  }
  if (req.url === "/") {
    const content = readFileSync("index.html");
    const length = Buffer.byteLength(content);

    res.writeHead(200, {
      "Content-Type": "text/html",
      "Content-Length": length
    });
    res.end(content);
  }
});

const io = new Server(httpServer, {
  // Socket.IO options
});

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

httpServer.listen(3000);

let timer = 369180;
let running = true;

function yourFunction() {
  if (running) {
    if (timer > 0) {
      io.emit("down", timer--);
    }
    if (timer === 0) {
      io.emit("finish", timer--);
    }
  }

  setTimeout(yourFunction, 1000);
}

yourFunction();

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  }
  const commandName = msg.trim();
  if (
    context.badges != null &&
    (context.badges.broadcaster != null || context.badges.moderator != null)
  ) {
    if (commandName === "!startCount") {
      running = true;
    }
    if (commandName === "!stopCount") {
      running = false;
    }
  }
}

client.on("cheer", (channel, username, userstate, message) => {
  console.log(userstate);
  timer += userstate.bits * 3;
});

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
