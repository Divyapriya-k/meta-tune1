import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import userRoute from "./Routers/user.router.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.get("/", (req, res) => {
    res.status(200).send("welcome to meta tunes");
});

app.use("/api/auth", userRoute);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("server is started and running on the port");
});