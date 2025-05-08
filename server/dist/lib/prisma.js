"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const userExtensions_1 = __importDefault(require("@prismaExtensions/userExtensions"));
const prisma = new client_1.PrismaClient().$extends(userExtensions_1.default);
exports.default = prisma;
