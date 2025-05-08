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
exports.deleteTask = exports.updateTask = exports.indexTasks = exports.createTask = exports.verifyAccessability = void 0;
const prisma_1 = __importDefault(require("@lib/prisma"));
const verifyAccessability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // verify if the user has access to the project
    const projectId = parseInt(req.params.projectId);
    const userId = req.userId;
    if (!userId || !projectId) {
        throw new Error("Missing userId or projectId");
    }
    try {
        const project = yield prisma_1.default.project.findUnique({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            res.status(400).send({ message: "Can't find the project" });
            return;
        }
        if (project.userId !== req.userId) {
            res.status(401).send({ message: "Unauthenticated" });
            return;
        }
        next();
    }
    catch (e) {
        console.log(e);
        next(e);
    }
});
exports.verifyAccessability = verifyAccessability;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const description = req.body.description;
    const projectId = parseInt(req.params.projectId);
    if (!projectId) {
        res.status(400).send({ message: "No project id" });
        return;
    }
    try {
        const newTask = yield prisma_1.default.task.create({
            data: {
                description: description,
                projectId: projectId,
            }
        });
        res.status(200).send({ task: newTask });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while creating the task" });
    }
});
exports.createTask = createTask;
const indexTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = parseInt(req.params.projectId);
    if (!projectId) {
        res.status(400).send({ message: "Missing project id" });
        return;
    }
    try {
        const tasks = prisma_1.default.task.findMany({
            where: {
                projectId: projectId,
            },
        });
        res.status(200).send({ tasks: tasks });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while indexing tasks" });
    }
});
exports.indexTasks = indexTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.taskId);
    const newDescription = req.body.description;
    if (!taskId) {
        res.status(400).send({ message: "Missing task id" });
        return;
    }
    try {
        const task = yield prisma_1.default.task.update({
            where: {
                id: taskId,
            },
            data: {
                description: newDescription,
            }
        });
        res.status(200).send({ task: task });
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.taskId);
    if (!taskId) {
        res.status(400).send({ message: "Missing task id" });
        return;
    }
    try {
        const task = yield prisma_1.default.task.delete({
            where: {
                id: taskId,
            },
        });
        res.status(200).send({ task: task });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: "Something went wrong while deleting the task" });
    }
});
exports.deleteTask = deleteTask;
