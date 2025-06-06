import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import ms, { StringValue } from 'ms';
import * as userService from '@services/userServices';

dotenv.config();

// export const changePassword = async (req: Request, res: Response) => {
//     const newPassword = req.body.password;
//     try {
//         const updateUser = await prisma.user.update({
//             where: {
//                 id: req.userId,
//             }, 
//             data: {
//                 password: newPassword,
//             },
//         });
//     } catch(e) {
//         console.log(e);
//         res.status(500).json({ message: "Something went wrong while changing the password." });
//     }
// }

// // divide this -> validate user credential input(middleware) and find the user in service
// export const findUserByCredentials = async (req: Request, res: Response, next: NextFunction) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     if (!email || !password) {
//         throw new Error("Missing credentials");
//     }
    
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 email: email,
//             },
//         });

//         if(!user) {
//             throw new Error("Can't find the user");
//         }

//         if (!await bcrypt.compare(password, user.password)) {
//             throw new Error("Incorrect Password");
//         }

//         req.userId = user.id;
//         req.username = user.name;
//         next();

//     } catch (e) {
//         console.log(e);
//         // TODO: Error handling middleware, this would skip the next middleware and go to the error handling middleware
//         next(e);
//     }
// }

// export const generateJWT = async (req: Request, res: Response, next: NextFunction) => { 
//     const secret = process.env.JWT_SECRET as string;
//     const expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

//     if (!secret || !expiresIn) {
//         throw new Error("Missing JWT_SECRET or JWT_EXPIRES_IN in environment");
//     }

//     if (!req.userId) {
//         throw new Error("Missing user id");
//     }

//     // Generate the token and save it to the database
//     try {
//         const token = await prisma.token.create({
//             data: {
//                 token: jwt.sign({ userId: req.userId }, secret, { expiresIn }),
//                 expiration: new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN as StringValue)),
//                 userId: req.userId,
//             },
//         });
//         req.token = token;
//     } catch (e) {
//         console.log(e);
//         next(e);
//     }
//     next();
// }

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        res.status(400).json({ message: "Missing credentials" });
        return;
    }

    try {
        const user = await userService.createUser(name, email, password);

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
        const user = await userService.findUserByCredentials(req.body.email, req.body.password);
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.userId = user.id; 
        const token = await userService.generateToken(req.userId);
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
        const user = await userService.findUserById(req.userId);
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