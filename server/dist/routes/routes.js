"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("@controllers/user-controller"));
const projectController = __importStar(require("@controllers/project-controller"));
const taskController = __importStar(require("@controllers/task-controller"));
const router = (0, express_1.Router)();
// route setting for users
router.post('/api/auth/register', userController.createUser, userController.generateJWT);
router.post('/api/auth/login', userController.findUserByCredentials, userController.generateJWT, userController.loginUser);
router.patch('/api/auth/change-password', userController.requireAuthentication, userController.changePassword);
// route setting for projects
router.post('/projects', userController.requireAuthentication, projectController.createProject);
router.get('/projects', userController.requireAuthentication, projectController.indexProjects);
router.patch('/projects/:id', userController.requireAuthentication, projectController.updateProject);
router.delete('/projects/:id', userController.requireAuthentication, projectController.deleteProject);
//route setting for tasks
router.post('/projects/:id/tasks', userController.requireAuthentication, taskController.verifyAccessability, taskController.createTask);
router.get('/projects/:id/tasks', userController.requireAuthentication, taskController.verifyAccessability, taskController.indexTasks);
router.patch('/tasks/:id', userController.requireAuthentication, taskController.verifyAccessability, taskController.updateTask);
router.delete('/tasks/:id', userController.requireAuthentication, taskController.verifyAccessability, taskController.deleteTask);
exports.default = router;
