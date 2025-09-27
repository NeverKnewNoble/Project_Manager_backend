import express from "express"
import { authenticateUser } from "../middleware/auth";
const router = express.Router();

// Routes
router.get("", authenticateUser, );


export default router; 
