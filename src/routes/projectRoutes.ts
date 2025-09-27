import express from "express";
import {createProject, getAllProjects, getProjectById, updateProject, deleteProject} from "../controllers/projectController";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

//? Define Endpoints
// All routes require authentication
router.get("/", authenticateUser, getAllProjects);  // Get All Projects
router.post("/create", authenticateUser, createProject);  // Create Projects
router.put("/update/:id", authenticateUser, updateProject);  // Update Projects by id
router.delete("/delete/:id", authenticateUser, deleteProject);  // Delete Project by id
router.get("/:id", authenticateUser, getProjectById);  // Get Projects By ID


export default router;