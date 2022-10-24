import express from "express";
import cors from "cors";
import { apiRoutes } from "./api-routes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // config cors so that front-end can use
app.options("*", cors()); // enable pre-flight across-the-board

app.get("/", (req, res) => {
    res.send("Hello World from history-service");
});

app.use('/api', apiRoutes);

app.listen(8003, () => console.log('History service listening on port 8003'));