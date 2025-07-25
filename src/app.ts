import "dotenv/config";
import express from "express";
import userRouter from "./routes/UserRoutes";
import errorMiddleWare from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
import customerRouter from "./routes/CustomerRoutes";
import serviceRouter from "./routes/ServiceRoutes";

const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/services", serviceRouter);
app.use(errorMiddleWare);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
