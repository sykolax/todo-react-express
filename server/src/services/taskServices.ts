import prisma from '@lib/prisma';
import type { Context } from '@context/context';
import type { CreateTask, IndexTask, UpdateTask, TaskWithId } from '@type/task.types'

export const createTask = async (task: CreateTask, ctx: Context) => {
    try {
        const newTask = await ctx.prisma.task.create({
            data: {
                description: task.newDescription, 
                projectId: task.projectId,
            }
        });
        return newTask;
    } catch (e) {
        console.log(e);
    }
}

export const indexTasks = async (task: IndexTask, ctx: Context) => {
    try {
        const project = await ctx.prisma.project.findUnique({
            where: {
                id: task.projectId, 
            }, 
            include: {
                tasks: true,
            }
        });
        return project;
    } catch (e) {
        console.log(e);
    }
}

export const updateTask = async (task: UpdateTask, ctx: Context) => {
    try {
        const updatedTask = await ctx.prisma.task.update({
            where: {
                id: task.taskId,
            }, 
            data: {
                description: task.newDescription,
                completed: task.newCompletedStatus,
            }
        });
        return updatedTask;
    } catch (e) {
        console.log(e);
    }
}

export const deleteTask = async (task: TaskWithId, ctx: Context) => {
    try {
        const deletedTask = await ctx.prisma.task.delete({
            where: {
                id: task.taskId,
            }
        });
        return deletedTask;
    } catch (e) {
        console.log(e);
    }
}

export const getProjectId = async (task: TaskWithId, ctx: Context) => {
    try {
        const foundTask = await prisma.task.findUnique({
            where: {
                id: task.taskId,
            }
        });
        return foundTask?.projectId;
    } catch (e) {
        console.log(e);
    }
}