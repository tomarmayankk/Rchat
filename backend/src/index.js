import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
const PORT = process.env.PORT || 5001; 

dotenv.config(); // Load environment variables
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); //cookie parser
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
})); //

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
