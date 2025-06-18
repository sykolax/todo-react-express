import prisma from '@lib/prisma';
import { Context } from '@context/context';
import type { IndexProject, CreateProject, UpdateProject, DeleteProject } from '@type/project.types';

export const findUserRecordWithProjects = async (project: IndexProject, ctx: Context) => {
    const user = await ctx.prisma.user.findUnique({
        where: {
            id: project.userId,
        }, 
        include: {
            projects: true, // By default, returned records do not include relations, only scalar fields
        }
    });
    return user;
}

export const createProject = async (project: CreateProject, ctx: Context) => {
    const newProject = await ctx.prisma.project.create({
        data: {
            title: project.title, 
            userId: project.userId,
        }
    });
    return newProject;
}

export const updateProject = async (project: UpdateProject, ctx: Context) => {
    const updatedProject = await ctx.prisma.project.update({
        where: {
            id: project.projectId,
            userId: project.userId,
        }, 
        data: {
            title: project.newTitle,
        }
    });
    return updatedProject;
}

export const deleteProject = async (project: DeleteProject, ctx: Context) => {
    const tasks = await ctx.prisma.task.deleteMany({
        where: {
            projectId: project.projectId,
        }
    });

    const deletedProject = await ctx.prisma.project.delete({
        where: {
            id: project.projectId, 
            userId: project.userId,
        }
    });
    return deletedProject;
}