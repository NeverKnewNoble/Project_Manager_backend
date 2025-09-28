import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.route";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import connectDB from "./config/db";

dotenv.config();

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// ? routes
app.get("/", (req, res) => { res.send("🚀 API is running..."); });
app.use("/auth", authRouter);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);
 


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
