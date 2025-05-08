import { Response, Request, NextFunction } from "express";
import prisma from '@lib/prisma';

export const findUserRecordWithProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            }, 
            include: {
                projects: true,
            },
        });

        if (!user) {
            throw new Error("Couldn't find the user");
        }
        // store user somewhere? 
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const indexProjects = async (req: Request, res: Response) => {
    // assumes req.userId to be set(runs requireAutnetication before this)

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            include: {
                projects: true, // By default, returned records do not include relations, only scalar fields
            },
        });

        if (!user) {
            res.status(500).send({ message: "Couldn't find the user" });
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
        const newProject = await prisma.project.create({
            data: {
                title: title,
                userId: userId,
            },
        });
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
        const project = await prisma.project.update({
            where: {
                id: projectId,
                userId: userId,
            }, 
            data: {
                title: newTitle,
            },
        });
        res.status(200).send({ project: project });
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
        const project = await prisma.project.delete({
            where: {
                id: projectId,
                userId: userId,
            },
        });
        res.status(200).send({ project: project });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the project "});
    }
}
