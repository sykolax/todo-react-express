import prisma from '@lib/prisma';

export const createTask = async (projectId: number, newDescription: string) => {
    try {
        const newTask = await prisma.task.create({
            data: {
                description: newDescription, 
                projectId: projectId,
            }
        });
        return newTask;
    } catch (e) {
        console.log(e);
    }
}

export const indexTasks = async (projectId: number) => {
    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId, 
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

export const updateTask = async (taskId: number, newDescription: string, newCompletedStatus: boolean) => {
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
        return task;
    } catch (e) {
        console.log(e);
    }
}

export const deleteTask = async (taskId: number) => {
    try {
        const task = await prisma.task.delete({
            where: {
                id: taskId,
            }
        });
        return task;
    } catch (e) {
        console.log(e);
    }
}