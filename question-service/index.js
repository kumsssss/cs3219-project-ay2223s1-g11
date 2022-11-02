import express from "express";
import cors from "cors";
import { apiRoutes } from "./api-routes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors()); // config cors so that front-end can use
app.options("*", cors()); // enable pre-flight across-the-board

app.get("/", (req, res) => {
    res.send("Hello World from question-service");
});

app.use('/api', apiRoutes);

var port = process.env.PORT || 8002;

app.listen(port, () => console.log(`Question service listening on port ${port}`));

export default app;
