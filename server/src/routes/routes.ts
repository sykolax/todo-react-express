import { Router } from 'express';
import * as userController from '@controllers/userController';
import * as projectController from '@controllers/projectController';
import * as taskController from '@controllers/taskController';
import * as authMiddleware from '@middlewares/authMiddleware';
import * as projectMiddleware from '@middlewares/projectMiddleware';

const router = Router();

// route setting for users
router.post('/auth/register', userController.createUser, userController.loginUser);
router.post('/auth/login', authMiddleware.validateUserCredentials, userController.loginUser);
router.post('/auth/logout', userController.logoutUser);
router.get('/auth/status', authMiddleware.requireAuthentication, userController.verifyStatus);

// route setting for projects 
router.post('/projects', authMiddleware.requireAuthentication, projectController.createProject);
router.get('/projects', authMiddleware.requireAuthentication, projectController.indexProjects);
router.patch('/projects/:projectId', authMiddleware.requireAuthentication, projectController.updateProject);
router.delete('/projects/:projectId', authMiddleware.requireAuthentication, projectController.deleteProject);

//route setting for tasks
router.post('/projects/:projectId/tasks', authMiddleware.requireAuthentication, projectMiddleware.verifyAccessability, taskController.createTask);
router.get('/projects/:projectId/tasks', authMiddleware.requireAuthentication,projectMiddleware.verifyAccessability, taskController.indexTasks);
router.patch('/tasks/:taskId', authMiddleware.requireAuthentication, taskController.getProjectId, projectMiddleware.verifyAccessability, taskController.updateTask);
router.delete('/tasks/:taskId', authMiddleware.requireAuthentication,  taskController.getProjectId, projectMiddleware.verifyAccessability, taskController.deleteTask);

export default router;