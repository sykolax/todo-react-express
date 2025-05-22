import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';
import prisma from '@lib/prisma';

/*
TODO 
1. Create user
    1) POST('/api/auth/register')
    2) Body - email, name, password
    3) Return - generated token(register - automatically logged in)
2. Login
    1) POST('/api/auth/login')
    2) Body - email and password
    3) Return - generated token
** nice to haves
3. Update password
    1) POST('/api/auth/reset-password')
    2) Body - new password 
    3) Header - token(validate the token)
4. Delete user
    1) POST('/api/auth/delete-user')
    2) Body - email(?)
    3) Header - token
*/

dotenv.config();
// Extension for hashing - create and update password is hashed

export const changePassword = async (req: Request, res: Response) => {
    const newPassword = req.body.password;
    try {
        const updateUser = await prisma.user.update({
            where: {
                id: req.userId,
            }, 
            data: {
                password: newPassword,
            },
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong while changing the password." });
    }
}

export const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    // JWT Toekn verification, verify if it hasn't been altered
    const secret = process.env.JWT_SECRET as string;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // split "Bearer [token_value]"

    if (!secret) {
        throw new Error("No secret has been defined in the environment");
    }

    if (!token) {
        throw new Error("No token found in the header");
    }

    try {
        // this decodes the payload only if the signature is valid
        // and checks the token has not been tampered with
        const payload = jwt.verify(token, secret) as JwtPayload;
        req.userId = payload.userId;
        next();
    } catch (e) {
        console.log(e);
        next(e);
    }
}

export const findUserByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        throw new Error("Missing credentials");
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if(!user) {
            throw new Error("Can't find the user");
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new Error("Incorrect Password");
        }

        req.userId = user.id;
        next();

    } catch (e) {
        console.log(e);
        // TODO: Error handling middleware, this would skip the next middleware and go to the error handling middleware
        next(e);
    }
}

export const generateJWT = async (req: Request, res: Response, next: NextFunction) => { 
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

    if (!secret || !expiresIn) {
        throw new Error("Missing JWT_SECRET or JWT_EXPIRES_IN in environment");
    }

    if (!req.userId) {
        throw new Error("Missing user id");
    }

    // Generate the token and save it to the database
    try {
        const token = await prisma.token.create({
            data: {
                token: jwt.sign({ userId: req.userId }, secret, { expiresIn }),
                expiration: new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN as StringValue)),
                userId: req.userId,
            },
        });
        req.token = token;
    } catch (e) {
        console.log(e);
        next(e);
    }
    next();
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: password,
            },
        });
        req.userId = user.id;
        next();

    } catch(e) {
        console.log(e);
        next(e);
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Missing user id" });
            return;
        }
        if (!req.token) {
            res.status(401).json({ message: "Missing token" });
            return;
        } 
        res.status(200).json({ token: req.token, user: req.userId });
    } catch(e) {
        console.log(e);
        res.status(401).json({ message: (e as Error).message || "Unauthorized" });
    }
}