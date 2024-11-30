import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminAuthorization from "./middleware/adminAuthorization.js"; 
import authController from "./auth/auth.controller.js";
import userController from "./user/user.controller.js";
import itemController from "./item/item.controller.js";  
import transactionController from "./transaction/transaction.controller.js";  
dotenv.config();

const app = express();

app.use(express.json());
const allowedOrigins = ['https://inventory-management-frontend-pi.vercel.app/']; // Sesuaikan dengan URL FE
const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));


app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.use("/api/auth", authController);
app.use("/api/users", adminAuthorization, userController);
app.use("/api/items", itemController);
app.use("/api/transactions", transactionController);

export default app;
