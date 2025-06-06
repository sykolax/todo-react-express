import prisma from '@lib/prisma';

export const findUserRecordWithProjects = async (userId: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }, 
            include: {
                projects: true, // By default, returned records do not include relations, only scalar fields
            }
        });
        return user;
    } catch (e) {
        console.log(e);
    }
}

export const createProject = async (title: string, userId: number) => {
    try {
        const project = await prisma.project.create({
            data: {
                title: title, 
                userId: userId,
            }
        });
        return project;
    } catch (e) {
        console.log(e);
    }
}

export const updateProject = async (newTitle: string, projectId: number, userId: number) => {
    try {
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
                userId: userId,
            }, 
            data: {
                title: newTitle,
            }
        });
        return updatedProject;
    } catch (e) {
        console.log(e);
    }
}

export const deleteProject = async (projectId: number, userId: number) => {
    try {
        const tasks = await prisma.task.deleteMany({
            where: {
                projectId: projectId,
            }
        });

        const project = await prisma.project.delete({
            where: {
                id: projectId, 
                userId: userId,
            }
        });
        return project;
    } catch (e) {
        console.log(e);
    }
}