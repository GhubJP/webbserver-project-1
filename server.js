const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static("./webbsida"));
app.use(bodyParser.urlencoded({ extended: false }));

let messages = [
  { name: "Mathias", message: "Hej" },
  { name: "Henrik", message: "Hallå" }
];

app.post("/meddelanden", (req, res) => {
  messages.push(req.body);
  io.emit("message", req.body);
  res.sendStatus(200);
});

app.get("/images", (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    res.status(400).send({ error: "Image URL is missing." });
    return;
  }

  fs.readFile(imageUrl, (err, data) => {
    if (err) {
      res.status(500).send({ error: `Failed to read the image.\n${err.message}` });
      return;
    }

    res.set("Content-Type", "image/jpeg");
    res.send(data);
  });
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("messages", messages);
});

http.listen(300, () => {
  console.log("Our server is up, visit it at http://localhost:300");
});

