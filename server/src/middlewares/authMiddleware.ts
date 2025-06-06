import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    // JWT Token verification, verify if it hasn't been altered
    const secret = process.env.JWT_SECRET as string;
    // const authHeader = req.headers.authorization;
    // const token = authHeader?.split(" ")[1]; // split "Bearer [token_value]"
    if (!req.cookies.token) {
        res.status(401).json({ message: "No token in cookies" });
        return;
    }
    const token = req.cookies.token; //token value

    if (!secret) {
        throw new Error("No secret has been defined in the environment");
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
        // TokenExpiredError
    }
}

export const validateUserCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log("validating...");

    if (!email || !password) {
        res.status(400).json({ message: "Missing credentials" });
        return;
    }
    next();
}

