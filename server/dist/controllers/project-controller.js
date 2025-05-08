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
exports.deleteProject = exports.updateProject = exports.createProject = exports.indexProjects = exports.findUserRecordWithProjects = void 0;
const prisma_1 = __importDefault(require("@lib/prisma"));
const findUserRecordWithProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: req.userId,
            },
            include: {
                projects: true,
            },
        });
        if (!user) {
            throw new Error("Couldn't find the user");
        }
        // store user somewhere? 
        next();
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.findUserRecordWithProjects = findUserRecordWithProjects;
const indexProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // assumes req.userId to be set(runs requireAutnetication before this)
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: req.userId,
            },
            include: {
                projects: true, // By default, returned records do not include relations, only scalar fields
            },
        });
        if (!user) {
            res.status(500).send({ message: "Couldn't find the user" });
            return;
        }
        res.send({ projects: user.projects });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while retrieving projects" });
    }
});
exports.indexProjects = indexProjects;
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const userId = req.userId;
    if (!userId) {
        res.status(401).send({ message: "Not authorized" });
        return;
    }
    try {
        const newProject = yield prisma_1.default.project.create({
            data: {
                title: title,
                userId: userId,
            },
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while creating the project" });
    }
});
exports.createProject = createProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Given project id, edit proejct title
    const projectId = parseInt(req.params.projectId);
    const userId = req.userId;
    const newTitle = req.body.title;
    if (!projectId) {
        res.status(400).send({ message: "Project id not found" });
        return;
    }
    if (!userId) {
        res.status(401).send({ message: "Unauthorized access" });
        return;
    }
    try {
        const project = yield prisma_1.default.project.update({
            where: {
                id: projectId,
                userId: userId,
            },
            data: {
                title: newTitle,
            },
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while updating the project" });
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Given project id, delete the project 
    const projectId = parseInt(req.params.projectId);
    const userId = req.userId;
    if (!projectId) {
        res.status(400).send({ message: "Project id not found" });
        return;
    }
    if (!userId) {
        res.status(401).send({ message: "Unauthorized access" });
        return;
    }
    try {
        const project = yield prisma_1.default.project.delete({
            where: {
                id: projectId,
                userId: userId,
            },
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the project " });
    }
});
exports.deleteProject = deleteProject;
