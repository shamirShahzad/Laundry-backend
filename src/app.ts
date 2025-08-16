import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/UserRoutes";
import errorMiddleWare from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
import customerRouter from "./routes/CustomerRoutes";
import serviceRouter from "./routes/ServiceRoutes";
import itemRouter from "./routes/ItemRoutes";
import { orderRouter } from "./routes/OrderRoutes";
import path from "path";
import dashboardRouter from "./routes/DashboardRoutes";

const app = express();
const port = process.env.PORT || 3000;

//Cors
app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use(errorMiddleWare);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
