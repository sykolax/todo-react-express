import { Response, Request, NextFunction } from 'express';
import prisma from '@lib/prisma';
import * as taskService from '@services/taskServices';

export const createTask = async (req: Request, res: Response) => {
    const description = req.body.description as string;
    const projectId = parseInt(req.params.projectId);

    if (!projectId) {
        res.status(400).send({ message: "No project id" });
        return;
    }

    try {
        const newTask = await taskService.createTask({ projectId: projectId, newDescription: description }, { prisma });
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
        const project = await taskService.indexTasks({ projectId: projectId }, { prisma });
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
        const projectId = await taskService.getProjectId({ taskId: taskId }, { prisma });
        req.projectId = projectId;
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
        const task = await taskService.updateTask({ taskId: taskId, newDescription: newDescription, newCompletedStatus: newCompletedStatus }, { prisma });
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
        const task = await taskService.deleteTask({ taskId: taskId }, { prisma });
        res.status(200).send({ task: task });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the task" });
    }
}