import prisma from '@lib/prisma';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';

dotenv.config();

export const findUserByCredentials = async (email: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error("Can't find the user.");
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new Error("Incorrect password.");
        }

        return { id: user.id, name: user.name };
    } catch (e) {
        console.log(e);
    }
}

export const createUser = async (name: string, email: string, password: string) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: password,
            }
        });
        
        return { id: user.id, name: user.name };
    } catch (e) {
        console.log(e);
    }
}

export const generateToken = async (id: number) => {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN as StringValue;

    try {
        const token = await prisma.token.create({
            data: {
                token: jwt.sign({ userId: id }, secret, { expiresIn }),
                expiration: new Date(Date.now() + ms(expiresIn)),
                userId: id,
            },
        });
        return token;
    } catch (e) {
        console.log(e);
    }
}

export const changePassword = async (id: number, newPassword: string) => {
    try {
        const updatePassword = await prisma.user.update({
            where: {
                id: id,
            }, 
            data: {
                password: newPassword,
            }
        });
        return updatePassword;
    } catch (e) {
        console.log(e);
    }
}

export const findUserById = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        return user;
    } catch (e) {
        console.log(e);
    }
}