import express from "express"
import { authenticateUser } from "../middleware/auth";
const router = express.Router();
import { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById} from "../controllers/taskContolller"

//? Define Endpoints
// All routes require authentication
router.get("/project/:projectName", authenticateUser, getAllTasks); // Get all tasks for a project by name
router.post("/create", authenticateUser, createTask); // Create task for a project by name
router.put("/update/:id", authenticateUser, updateTaskById); // Update task
router.delete("/delete/:id", authenticateUser, deleteTaskById); // Delete task
router.get("/:id", authenticateUser, getTaskById); // Get task by id


export default router; 