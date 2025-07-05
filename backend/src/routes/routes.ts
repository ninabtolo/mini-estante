import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import BookController from '../controllers/BookController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const routes = Router();

// rotas públicas
routes.post('/login', AuthController.login);
routes.post('/logout', AuthController.logout);

// Rotas para recuperação de senha
// Estas rotas seriam públicas pois são acessadas antes do login
// routes.post('/forgot-password', AuthController.forgotPassword);
// routes.get('/reset-password/validate/:token', AuthController.validateResetToken);
// routes.post('/reset-password/:token', AuthController.resetPassword);

// rotas protegidas
routes.use(authMiddleware);

// rotas de livros (todos os usuários autenticados)
routes.get('/books', BookController.index);
routes.get('/books/:id', BookController.show);
routes.post('/books', BookController.create);
routes.put('/books/:id', BookController.update);
routes.delete('/books/:id', BookController.delete);

// rota para alteração de senha (qualquer usuário autenticado)
routes.post('/users/change-password', UserController.changePassword);

// rotas do admin
routes.post('/users', adminMiddleware, UserController.create);
routes.get('/users', adminMiddleware, UserController.index);
routes.patch('/users/:username/status', adminMiddleware, UserController.changeStatus);

export default routes;
