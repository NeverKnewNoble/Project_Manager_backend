import { Request, Response } from "express"
import {Task} from "../models/Task";

//? CREATE TASK - POST
//! Create tasks linked to project - post
export const createTask = async (req: Request, res: Response) => {
    try {
        // check user authentication
        if (!req.user) {
            res.status(401).json({ error: "You are not Authenticated"});
        }

        const { title, description, status } = req.body;

        if (!title) {
            res.status(401).json({ error: "Please provide a title"});
        }

        const createTask = new Task({
            owner_id: req.user.id, 
            title,
            description,
            status
        }) 

        await createTask.save();
        res.status(201).json({ success: `Project ${title} created successfully`});
    }catch(err) {
        res.status(500).json({ error: "Unable to create task"});
    }
};