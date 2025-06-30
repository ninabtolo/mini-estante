import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const routes = Router();

// rotas públicas
routes.post('/login', AuthController.login);
routes.post('/logout', AuthController.logout);

// rotas protegidas
routes.use(authMiddleware);

// rotas do admin
routes.post('/users', adminMiddleware, UserController.create);
routes.get('/users', adminMiddleware, UserController.index);
routes.patch('/users/:username/status', adminMiddleware, UserController.changeStatus);

export default routes;
