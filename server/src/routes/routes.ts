import { Router } from 'express';
import * as userController from '@controllers/user-controller';
import * as projectController from '@controllers/project-controller';
import * as taskController from '@controllers/task-controller';

const router = Router();

// route setting for users
router.post('/auth/register', userController.createUser, userController.generateJWT, userController.loginUser);
router.post('/auth/login', userController.findUserByCredentials, userController.generateJWT, userController.loginUser);
router.patch('/auth/change-password', userController.requireAuthentication, userController.changePassword);

// route setting for projects
router.post('/projects', userController.requireAuthentication, projectController.createProject);
router.get('/projects', userController.requireAuthentication, projectController.indexProjects);
router.patch('/projects/:projectId', userController.requireAuthentication, projectController.updateProject);
router.delete('/projects/:projectId', userController.requireAuthentication, projectController.deleteProject);

//route setting for tasks
router.post('/projects/:projectId/tasks', userController.requireAuthentication, taskController.verifyAccessability, taskController.createTask);
router.get('/projects/:projectId/tasks', userController.requireAuthentication,taskController.verifyAccessability, taskController.indexTasks);
router.patch('/tasks/:taskId', userController.requireAuthentication, taskController.getProjectId, taskController.verifyAccessability, taskController.updateTask);
router.delete('/tasks/:taskId', userController.requireAuthentication,  taskController.getProjectId, taskController.verifyAccessability, taskController.deleteTask);

export default router;