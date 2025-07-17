import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';
import * as userService from '@services/userServices';
import prisma from '@lib/prisma';

dotenv.config();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        res.status(400).json({ message: "Missing credentials" });
        return;
    }

    try {
        const user = await userService.createUser({ email: email, password: password, name: name }, { prisma });
        

        if (!user) {
            res.status(500).json({ message: "Something went wrong." });
            return;
        }

        req.userId = user.id;
        req.username = user.name;
        next();
    } catch(e) {
        console.log(e);
        next(e);
    }
}

export const loginUser = async (req: Request, res: Response) => {

    try {
        const user = await userService.findUserByCredentials({email: req.body.email, password:req.body.password}, { prisma });
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.userId = user.id; 
        const token = await userService.generateToken({ id: req.userId! }, { prisma });
        if (!token) {
            res.status(500).json({ message: "Something went wrong while generating token" });
            return;
        }
        res.cookie('token', token.token, {httpOnly: true, expires: new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN as StringValue)),});
        res.status(200).json({ user: user.id, username: user.name });

    }  catch(e) {
        console.log(e);
        res.status(401).json({ message: (e as Error).message || "Unauthorized" });
    }

}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token');
        res.end();
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: (e as Error).message || "Something went wrong while logging out"});
    }
}

export const verifyStatus = async (req: Request, res: Response) => {
    if (!req.userId) {
        res.clearCookie('token');
        res.status(401).json({ message: "Not verified" });
        return;
    }

    try {
        const user = await userService.findUserById({ id: req.userId }, { prisma });
        if (!user) {
            res.clearCookie('token');
            res.status(401).json({ message: "Couldn't find the user" });
            return;
        }
        res.status(200).json({ userId: user.id, username: user.name });
    } catch (e) {
        console.log(e);
        res.clearCookie('token');
        res.status(401).json({ message: (e as Error).message || "Unauthorized" });
    }
}