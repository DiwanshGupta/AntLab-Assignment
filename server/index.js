import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/userRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import morgan from "morgan";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(morgan('dev'))
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],  
  credentials: true, 
}));

// Routes

app.use("/api/v1/user",authRouter);
app.use("/api/v1/tickets",ticketRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
