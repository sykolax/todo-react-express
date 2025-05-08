import { Response, Request, NextFunction } from 'express';
import prisma from '@lib/prisma';

export const verifyAccessability = async (req: Request, res: Response, next: NextFunction) => {
    // verify if the user has access to the project
    const projectId = parseInt(req.params.projectId) || req.projectId;
    const userId = req.userId; 

    if (!userId || !projectId) {
        throw new Error("Missing userId or projectId");
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });
        
        if (!project) {
            res.status(400).send({ message: "Can't find the project" });
            return;
        }

        if (project.userId !== req.userId) {
            res.status(401).send({ message: "Unauthenticated" });
            return;
        } 
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const createTask = async (req: Request, res: Response) => {
    const description = req.body.description as string;
    const projectId = parseInt(req.params.projectId);

    if (!projectId) {
        res.status(400).send({ message: "No project id" });
        return;
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                description: description,
                projectId: projectId, 
            }
        });

        res.status(200).send({ task: newTask });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while creating the task" });
    }
}

export const indexTasks = async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.projectId);

    if (!projectId) {
        res.status(400).send({ message: "Missing project id" });
        return;
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                tasks: true,
            },
        });
        if (!project) {
            res.status(400).send({ message: "Couldn't find the project" });
            return;
        }
        res.status(200).send({ tasks: project.tasks });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while indexing tasks" });
    }
}

export const getProjectId = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = parseInt(req.params.taskId);

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            }
        });
        if (!task) {
            throw new Error("Task not found");
        }
        req.projectId = task.projectId;
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const newDescription = req.body.description;
    const newCompletedStatus = req.body.completed;

    if (!taskId) {
        res.status(400).send({ message: "Missing task id" });
        return;
    }

    try {
        const task = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                description: newDescription,
                completed: newCompletedStatus,
            }
        });
        res.status(200).send({ task: task });
    } catch (e) {
        console.log(e);
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);

    if (!taskId) {
        res.status(400).send({ message: "Missing task id" });
        return;
    }

    try {  
        const task = await prisma.task.delete({
            where: {
                id: taskId,
            },
        });
        res.status(200).send({ task: task });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the task" });
    }
}