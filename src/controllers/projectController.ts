import { Project } from "../models/Project";
import { Request, Response } from "express";


//? CREATE PROJECT
//! Create project - POST
export const createProject = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Extract project data from request body (owner_id comes from authenticated user)
        const { name, description } = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }
        
        const createProject = new Project({
            owner_id: req.user.id, // User ID comes from authenticated session
            name,
            description
        });
        await createProject.save();
        res.status(201).json({ project: createProject });
    } catch(err){
        res.status(500).json({ error: "Unable to create project" });
    }
};


//? GET DATA
//! Get all projects - GET
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch(err) {
        res.status(500).json({ error: "Unable to get all projects" });
    }
}

//! Get Project by id - GET
export const getProjectById = async (req: Request, res: Response) => {
    try{
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: "Project Not Found" });
        }
        res.status(200).json({ project });
    }catch(err){
        res.status(500).json({ error: "Unable to get project" });
    }
}


//? UPDATE PROJECTS
//! Update project but only owner can update
export const updateProject = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if user is the owner (using owner_id field from model)
    if (project.owner_id.toString() !== req.user.id) {
      return res.status(403).json({ error: "You don't have authority to make changes" });
    }

    // Update project with new data
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: "Couldn't update project" });
  }
};

//? DELETE 
//! Delete Project 
export const deleteProject = async (req: Request, res: Response) => {
    try{
        // Check if user is authenticated
        if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
        }

        // finding project first
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (project.owner_id.toString() !== req.user.id){
            return res.status(403).json({ error: "You don't have authority to make changes" });
        }

        // Delete project
        const deleteproject = await Project.findByIdAndDelete(
            req.params.id,
            req.body
        );

        res.status(201).json({ res: `Project deleted` })
    }catch(err) {
        res.status(500).json({ error: "Unable to delete project."})
    }
};