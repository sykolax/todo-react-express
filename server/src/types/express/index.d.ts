import { User, Token } from '@prisma/client';

// Extend the Request type - to pass data b/w middlewares
declare global {
    namespace Express {
        interface Request {
            userId?: number;
            username?: string;
            token?: Token;
            projectId?: number;
            email?: string;
            password?: string;
        }
    }
}