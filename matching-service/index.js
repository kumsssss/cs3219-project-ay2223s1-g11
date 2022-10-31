import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { matchController } from "./controller/match-controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // config cors so that front-end can use
app.options("*", cors()); // enable pre-flight across-the-board

const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

// socket.io config
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => matchController(io, socket));

httpServer.listen(8001);
