jest.mock('ms', () => jest.fn());
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

import { MockContext, Context, createMockContext } from '@context/context';
import { createUser, findUserByCredentials, generateToken, changePassword, findUserById } from './userServices';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';

let mockCtx: MockContext;
let ctx: Context;
const input = {
    email: 'testing@test.com', 
    password: 'Hitesting!',
    name: 'tester',
};

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('Creates a user', async () => {
    const user = {
        ...input, 
        id: 1,
    };
    mockCtx.prisma.user.create.mockResolvedValue(user);

    await expect(createUser(input, ctx)).resolves.toEqual(user);
});

describe('FindUserByCredentials', () => {
    it('Finds the user', async () => {
        const { name, ...inputWithoutName } = input;
        
        const user = {
            ...input, 
            id: 1,
        };

        mockCtx.prisma.user.findUnique.mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockReturnValue(true);
        // const bcryptCompare = jest.fn().mockResolvedValue(true);
        // (bcrypt.compare as jest.Mock) = bcryptCompare;

        await expect(findUserByCredentials(inputWithoutName, ctx)).resolves.toEqual(user);
    });

    it('Throws no user found error', async () => {
        const wrongInput = {
            email: 'noexist@noexist.com',
            password: 'huh',
        };

        mockCtx.prisma.user.findUnique.mockResolvedValue(null); 

        await expect(findUserByCredentials(wrongInput, ctx)).rejects.toThrow("Can't find the user");
    });

    it('Throws incorrect password error', async () => {
        const wrongPassword = {
            email: 'testing@test.com',
            password: 'hohoho',
        };

        const user = {
            ...input, 
            id: 1,
        };

        mockCtx.prisma.user.findUnique.mockResolvedValue(user);
        (bcrypt.compare as jest.Mock).mockReturnValue(false);
        // const bcryptCompare = jest.fn().mockResolvedValue(false);
        // (bcrypt.compare as jest.Mock) = bcryptCompare;

        await expect(findUserByCredentials(wrongPassword, ctx)).rejects.toThrow('Incorrect password');
    });

});

describe('FindUserById', () => {
    it('Finds the user by id', async () => {
        const user = {
            ...input, 
            id: 1,
        };

        mockCtx.prisma.user.findUnique.mockResolvedValue(user);

        await expect(findUserById({ id: 1, }, ctx)).resolves.toEqual(user);
    }); 

    it('Throws no user found error with given id', async () => {
        mockCtx.prisma.user.findUnique.mockResolvedValue(null);
        await expect(findUserById({ id: 1, }, ctx)).rejects.toThrow('No user found with given id');
    });
});

describe('GenerateToken', () => {
    const fixedNow = new Date('2025-01-01T00:00:00Z').getTime();

    beforeEach(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => fixedNow);
        process.env.JWT_EXPIRES_IN = '2h';
        process.env.JWT_SECRET = 'mysecret';
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('Generates a token with correct expiration time', async () => {
        const mockMsValue = 720000;
        // const mockMsFn = jest.fn()
        (ms as jest.Mock).mockReturnValue(mockMsValue);
        
        const mockToken = 'mockedJWTValue';
        // const mockTokenFn = jest.fn()
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const user = { id: 1 };

        await generateToken(user, ctx);

        expect(ms).toHaveBeenCalledWith('2h' as StringValue);
        expect(mockCtx.prisma.token.create).toHaveBeenCalledWith({
            data: {
                token: mockToken,
                expiration: new Date(fixedNow + mockMsValue),
                userId: user.id,
            }
        });
    });

    it('Throws an error when jwt secret environment variable is not set', async () => {
        delete process.env.JWT_SECRET;
        await expect(generateToken({ id: 1 }, ctx)).rejects.toThrow('No secret set in environment');
    });

    it('Throws an error when jwt expiration environment variable is not set', async () => {
        delete process.env.JWT_EXPIRES_IN;
        await expect(generateToken({ id: 1 }, ctx)).rejects.toThrow('No expiration time set in environment');
    });
});
