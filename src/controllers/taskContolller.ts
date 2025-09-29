import { Request, Response } from "express"
import {Task} from "../models/Task";
import {Project} from "../models/Project";


//? CREATE TASKS
//! Create tasks linked to project by name - POST
export const createTask = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const { title, description, status, assigned_to, due_date, project_name } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ error: "Please provide a title"});
        }
        
        if (!description) {
            return res.status(400).json({ error: "Please provide a description"});
        }
        
        if (!assigned_to) {
            return res.status(400).json({ error: "Please provide assigned_to field"});
        }
        
        if (!due_date) {
            return res.status(400).json({ error: "Please provide a due_date"});
        }

        if (!project_name) {
            return res.status(400).json({ error: "Please provide a project_name"});
        }

        // Find the project by name and verify ownership
        const project = await Project.findOne({ 
            name: project_name, 
            owner_id: req.user.id 
        });

        if (!project) {
            return res.status(404).json({ 
                error: `Project "${project_name}" not found or you don't have access to it` 
            });
        }

        const newTask = new Task({
            owner_id: req.user.id, 
            project_id: (project._id as any).toString(), // Use the project's _id
            title,
            description,
            status: status || "Pending",
            assigned_to,
            due_date: new Date(due_date)
        }) 

        await newTask.save();
        res.status(201).json({ 
            res: `Task "${title}" created successfully for project "${project_name}"`, 
            task: newTask,
            project: {
                id: project._id,
                name: project.name
            }
        });
    }catch(err) {
        console.error("Create task error:", err);
        res.status(500).json({ error: "Unable to create task"});
    }
};


//? GET TASKS
//! Get all tasks for a specific project by name - GET
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const { projectName } = req.params;
        
        // First find the project by name and verify ownership
        const project = await Project.findOne({ 
            name: projectName, 
            owner_id: req.user.id 
        });

        if (!project) {
            return res.status(404).json({ 
                error: `Project "${projectName}" not found or you don't have access to it` 
            });
        }
        
        // Get tasks filtered by project ID and owner
        const getTasks = await Task.find({ 
            project_id: (project._id as any).toString(),
            owner_id: req.user.id 
        });
        
        res.status(200).json({ 
            res: getTasks,
            project: {
                id: project._id,
                name: project.name,
                description: project.description
            }
        });
    } catch(err) {
        console.error("Get tasks error:", err);
        res.status(500).json({error: "Unable to get tasks for this project"})
    }
};


//! Get Taks by ID - GET
export const getTaskById = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const getTaskByID = await Task.findById(req.params.id);

        if(!getTaskByID){
            return res.status(400).json({ error: "Can't Find your Task"})
        }
        res.status(200).json({ res: getTaskByID })
    } catch(err) {
        res.status(500).json({error: "Unable to get Task by ID"})
    }
};


//? UPDATE TASKS
//! Update Task by id - PUT
export const updateTaskById = async (req: Request, res: Response) => {
    try {
        // guard check authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const getTaskId = await Task.findById(req.params.id);
        // guard check if it finds the task by id 
        if (!getTaskId) {
            return res.status(401).json({ error: "Unasble to find Task"});
        }

        // Check if user is the owner (using owner_id field from model)
        if (getTaskId.owner_id.toString() !== req.user.id) {
            return res.status(403).json({ error: "You don't have authority to make changes" });
        }

        const UpdateTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // guard Check if it doesnt update
        if (!UpdateTask) {
            return res.status(402).json({error: "Unable to Update Task"})
        }
        res.status(200).json({ res: UpdateTask })
    } catch(err) {
        res.status(500).json({error: "Unable to update task"})
    }
}


//? DELETE TASKS
//! Delete task by id - DELETE 
export const deleteTaskById = async (req: Request, res: Response) => {
    try{
        // guard check authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"})
        }      

        const getTaskId = await Task.findById(req.params.id);
        // guard check if it finds the task by id 
        if (!getTaskId) {
            return res.status(401).json({ error: "Unasble to find Task"})
        }

        // Check if user is the owner (using owner_id field from model)
        if (getTaskId.owner_id.toString() !== req.user.id) {
            return res.status(403).json({ error: "You don't have authority to make changes" });
        }

        const deleteTask = await Task.findByIdAndDelete(req.params.id);
        res.status(201).json({ res: deleteTask })

    } catch(err) {
        res.status(500).json({error: "Unable to delete Task"})
    }
};