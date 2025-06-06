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
            res.status(401).send({ message: "Not authorized to access to the project" });
            return;
        } 
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
}

