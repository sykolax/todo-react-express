import prisma from '@lib/prisma';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import type { Context } from '@context/context';

dotenv.config();

export const findUserByCredentials = async (user: FindUserByCredentials, ctx: Context) => {

    const foundUser = await ctx.prisma.user.findUnique({
        where: {
            email: user.email,
        },
    });

    if (!foundUser) {
        throw new Error("Can't find the user");
    }

    if (!await bcrypt.compare(user.password, foundUser.password)) {
        throw new Error("Incorrect password");
    }

    return foundUser;
}

export const createUser = async (user: CreateUser, ctx: Context) => {

    const newUser = await ctx.prisma.user.create({
        data: {
            email: user.email,
            name: user.name,
            password: user.password,
        }
    });
    
    return newUser;
}

export const generateToken = async (user: FindUserById, ctx: Context) => {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRES_IN as StringValue;

    if (!secret) {
        throw new Error('No secret set in environment');
    }

    if (!expiresIn) {
        throw new Error('No expiration time set in environment');
    }

    const token = await ctx.prisma.token.create({
        data: {
            token: jwt.sign({ userId: user.id }, secret, { expiresIn }),
            expiration: new Date(Date.now() + ms(expiresIn)),
            userId: user.id,
        },
    });
    return token;
}

export const changePassword = async (user: UpdateUser, ctx: Context) => {
    const updatePassword = await ctx.prisma.user.update({
        where: {
            id: user.id,
        }, 
        data: {
            password: user.newPassword,
        }
    });
    return updatePassword;
}

export const findUserById = async (user: FindUserById, ctx: Context) => {
    const foundUser = await ctx.prisma.user.findUnique({
        where: {
            id: user.id,
        }
    });

    if (!foundUser) {
        throw new Error('No user found with given id');
    }
    return foundUser;

}