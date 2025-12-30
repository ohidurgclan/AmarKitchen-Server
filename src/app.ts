import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRouts } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { menuRoutes } from "./modules/menu/menu.routes";
import { orderRoutes } from "./modules/order/order.routes";
import { kitchenRoutes } from "./modules/kitchen/kitchen.routes";
const cors = require("cors");
const app = express()

// Express Json Parcer
app.use(express.json());
// app.use(express.urlencoded()); For Form Data

// initializing DB
initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Md Ohidur! Root API Routes is Ready To Serve . . .")
});
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", userRouts);
app.use("/v1/auth", authRoutes);
app.use("/v1", menuRoutes);
// app.use("v1/raider", raiderRoutes);
app.use("/v1/order", orderRoutes);
app.use("/v1/kitchen", kitchenRoutes);


//* 404 Not Found Route
app.use((req:Request, res: Response)=>{
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;