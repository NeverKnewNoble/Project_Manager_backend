import { Request, Response } from "express"
import {Task} from "../models/Task";


//? CREATE TASKS
//! Create tasks linked to project - POST
export const createTask = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Please provide a title"});
        }

        const createTask = new Task({
            owner_id: req.user.id, 
            title,
            description,
            status
        }) 

        await createTask.save();
        res.status(201).json({ res: `Project ${title} created successfully`});
    }catch(err) {
        res.status(500).json({ error: "Unable to create task"});
    }
};

//? GET TASKS
//! Get all tasks - GET
export const getAllTasks = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            return res.status(401).json({ error: "You are not Authenticated"});
        }

        const getTasks = await Task.find();
        
        // guard if unable to get tasks
        if (!getTasks) {
            return res.status(400).json({ error: "Unable to get all tasks"})
        }
        
        res.status(201).json({ res: getTasks });
    } catch(err) {
        res.status(500).json({error: "Unable to get all tasks"})
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