import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
    interface JwtPayload {
        userId: number;
    }
}