import "dotenv/config";
import express from "express";
import userRouter from "./routes/UserRoutes";

const app = express();
const port = process.env.PORT || 3000;

//Routes
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
