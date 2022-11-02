import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { collaborationController } from "./controller/collaboration-controller.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // config cors so that front-end can use
app.options("*", cors()); // enable pre-flight across-the-board

const httpServer = createServer(app);

app.get("/", (req, res) => {
    res.send("Hello World from collaboration-service");
});

// socket.io config
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => collaborationController(io, socket));

var port = process.env.PORT || 8008;

httpServer.listen(port, () => console.log(`collaboration-service listening on port ${port}`));

export default app;