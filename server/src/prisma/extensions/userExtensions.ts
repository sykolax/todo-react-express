import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

async function hashPassword(args: {data: any}) {
    if (args.data.password) {
        args.data.password = await bcrypt.hash(args.data.password, 10);
    }
}

export default Prisma.defineExtension({
    name: 'password-hashing-create-or-update',
    query: {
        user: {
            async create({ args, query }) {
                await hashPassword(args);
                return query(args);
            },
            async update({ args, query }) {
                await hashPassword(args);
                return query(args);
            }
        }
    }
})

