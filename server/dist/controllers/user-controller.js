"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.generateJWT = exports.findUserByCredentials = exports.requireAuthentication = exports.changePassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const ms_1 = __importDefault(require("ms"));
const prisma_1 = __importDefault(require("@lib/prisma"));
/*
TODO
1. Create user
    1) POST('/api/auth/register')
    2) Body - email, name, password
    3) Return - generated token(register - automatically logged in)
2. Login
    1) POST('/api/auth/login')
    2) Body - email and password
    3) Return - generated token
** nice to haves
3. Update password
    1) POST('/api/auth/reset-password')
    2) Body - new password
    3) Header - token(validate the token)
4. Delete user
    1) POST('/api/auth/delete-user')
    2) Body - email(?)
    3) Header - token
*/
dotenv_1.default.config();
// Extension for hashing - create and update password is hashed
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.password;
    try {
        const updateUser = yield prisma_1.default.user.update({
            where: {
                id: req.userId,
            },
            data: {
                password: newPassword,
            },
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while changing the password." });
    }
});
exports.changePassword = changePassword;
const requireAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // JWT Toekn verification, verify if it hasn't been altered
    const secret = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]; // split "Bearer [token_value]"
    if (!secret) {
        throw new Error("No secret has been defined in the environment");
    }
    if (!token) {
        throw new Error("No token found in the header");
    }
    try {
        // this decodes the payload only if the signature is valid
        // and checks the token has not been tampered with
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.userId = payload.userId;
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.requireAuthentication = requireAuthentication;
const findUserByCredentials = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        throw new Error("Missing credentials");
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("Can't find the user");
        }
        if (!(yield bcrypt_1.default.compare(user.password, password))) {
            throw new Error("Incorrect Password");
        }
        req.userId = user.id;
    }
    catch (e) {
        console.log(e);
        // TODO: Error handling middleware, this would skip the next middleware and go to the error handling middleware
        next(e);
    }
    next();
});
exports.findUserByCredentials = findUserByCredentials;
const generateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!secret || !expiresIn) {
        throw new Error("Missing JWT_SECRET or JWT_EXPIRES_IN in environment");
    }
    if (!req.userId) {
        throw new Error("Missing user id");
    }
    // Generate the token and save it to the database
    try {
        const token = yield prisma_1.default.token.create({
            data: {
                token: jsonwebtoken_1.default.sign({ userId: req.userId }, secret, { expiresIn }),
                expiration: new Date(Date.now() + (0, ms_1.default)(process.env.JWT_EXPIRES_IN)),
                userId: req.userId,
            },
        });
        req.token = token;
    }
    catch (e) {
        console.log(e);
        next(e);
    }
    next();
});
exports.generateJWT = generateJWT;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    try {
        const user = yield prisma_1.default.user.create({
            data: {
                email: email,
                name: name,
                password: password,
            },
        });
        next();
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            throw new Error("No user found");
        }
        if (!req.token) {
            throw new Error("No token found");
        }
        res.status(200).send({ token: req.token, user: req.userId });
    }
    catch (e) {
        console.log(e);
        res.status(401).json({ message: e.message || "Unauthorized" });
    }
});
exports.loginUser = loginUser;
