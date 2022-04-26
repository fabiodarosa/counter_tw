import { readFileSync } from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import tmi from "tmi.js";

const opts = {
  identity: {
    username: "8p1y7t6w4nycbxiq3l8hu34zwifmi8",
    password: "cnhiuma9i4km2krpcpsvluf3pmrbpt"
  },
  channels: ["fabiob_rosa"]
};

const client = new tmi.client(opts);

client.connect();

const httpServer = createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  // reload the file every time
  const content = readFileSync("index.html");
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": length
  });
  res.end(content);
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

let timer = 120;
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

  if (commandName === "!startCount") {
    this.running = true;
  }
  if (commandName === "!stopCount") {
    this.running = false;
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
