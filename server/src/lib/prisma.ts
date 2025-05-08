import { PrismaClient } from "@prisma/client";
import PrismaUserExtension from "@prismaExtensions/userExtensions";

const prisma = new PrismaClient().$extends(PrismaUserExtension);

export default prisma;