import { Response, Request, NextFunction } from "express";
import prisma from '@lib/prisma';
import * as projectService from '@services/projectServices';

export const indexProjects = async (req: Request, res: Response) => {
    // assumes req.userId to be set(runs requireAutnetication before this)

    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = await projectService.findUserRecordWithProjects({ userId: req.userId }, { prisma });

        if (!user) {
            res.status(401).send({ message: "Couldn't find the user" });
            return;
        }
        
        res.send({ projects: user.projects });
        
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while retrieving projects" });
    }
}

export const createProject = async (req: Request, res: Response) => {
    const title = req.body.title as string;
    const userId = req.userId;

    if (!userId) {
        res.status(401).send({ message: "Not authorized" });
        return;
    }

    try {
        const newProject = await projectService.createProject({ title: title, userId: userId }, { prisma });
        if (!newProject) {
            res.status(500).send({ message: "Something went wrong while creating the project" });
            return;
        }
        res.status(200).send({ project: newProject });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while creating the project" });
    }
} 

export const updateProject = async (req: Request, res: Response) => {
    // Given project id, edit proejct title
    const projectId = parseInt(req.params.projectId);
    const userId = req.userId;
    const newTitle = req.body.title;
    
    if (!projectId) {
        res.status(400).send({ message: "Project id not found" });
        return;
    }

    if (!userId) {
        res.status(401).send({ message: "Unauthorized access" });
        return;
    }

    try {
        const updatedProject = await projectService.updateProject({ newTitle: newTitle, projectId: projectId, userId: userId }, { prisma });
        if (!updatedProject) {
            res.status(500).send({ message: "Something went wrong while creating the project" });
            return;
        }
        res.status(200).send({ project: updatedProject });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while updating the project" });
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    // Given project id, delete the project 
    const projectId = parseInt(req.params.projectId);
    const userId = req.userId;

    if (!projectId) {
        res.status(400).send({ message: "Project id not found" });
        return;
    }

    if (!userId) {
        res.status(401).send({ message: "Unauthorized access" });
        return;
    }

    try {
        const project = await projectService.deleteProject({ projectId: projectId, userId: userId }, { prisma });
        res.status(200).send({ project: project });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the project "});
    }
}
