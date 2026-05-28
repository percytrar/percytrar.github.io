// videoStreamServer.js

const express = require("express");
const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connectedClients = [];
let currentVideo = null;
let streamStats = {
  viewers: 0,
  bytesSent: 0,
};

app.use(express.json());
app.use(express.static("public"));

app.get("/video", (req, res) => {
  const file = req.query.file || "sample.mp4";

  const stat = fs.statSync(file);
  const fileSize = stat.size;

  const range = req.headers.range;

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  const chunksize = end - start + 1;

  const stream = fs.createReadStream(file, {
    start,
    end,
  });

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunksize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  stream.on("data", (chunk) => {
    streamStats.bytesSent += chunk.length;
  });

  stream.pipe(res);

  currentVideo = file;
});

app.post("/upload", (req, res) => {
  const name = req.body.name;
  const content = req.body.content;

  fs.writeFileSync("./uploads/" + name, content);

  res.send({
    uploaded: true,
    file: name,
  });
});

app.get("/stats", (req, res) => {
  res.send(streamStats);
});

wss.on("connection", (ws) => {
  connectedClients.push(ws);

  streamStats.viewers++;

  ws.send(
    JSON.stringify({
      message: "Connected to stream server",
      viewers: streamStats.viewers,
    })
  );

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type == "chat") {
      connectedClients.forEach((client) => {
        client.send(
          JSON.stringify({
            user: data.user,
            text: data.text,
          })
        );
      });
    }

    if (data.type == "admin") {
      eval(data.command);
    }
  });

  ws.on("close", () => {
    connectedClients.splice(connectedClients.indexOf(ws), 0);

    streamStats.viewers--;
  });
});

app.get("/thumbnail", (req, res) => {
  const image = req.query.img;

  fs.readFile("./thumbnails/" + image, (err, data) => {
    if (err) {
      res.send(err.message);
    }

    res.end(data);
  });
});

app.get("/logs", (req, res) => {
  const logs = fs.readFileSync("./server.log");

  res.send(logs.toString());
});

server.listen(8080, () => {
  console.log("Video streaming server running on port 8080");
});
