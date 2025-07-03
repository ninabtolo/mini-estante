import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

class UserController {
  async create(req: Request, res: Response) {
    try {
      let { username, password, nome, tipo } = req.body;

      if (!username || !password || !nome || !tipo) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      username = username.trim();
      nome = nome.trim();
      tipo = tipo.trim();
      
      if (username.length > 30) {
        return res.status(400).json({ error: 'Nome de usuário deve ter 30 caracteres ou menos' });
      }

      if (nome.length > 120) {
        return res.status(400).json({ error: 'Nome deve ter 120 caracteres ou menos' });
      }

      const userExists = await prisma.user.findUnique({
        where: { username }
      });

      if (userExists) {
        return res.status(400).json({ error: 'Nome de usuário já existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          nome,
          tipo,
          status: 'A', // padrão = ativo
          quant_acesso: 0,
          failed_attempts: 0
        }
      });

      console.log(`Usuário criado com sucesso: ${username}`);

      return res.status(201).json({
        username: user.username,
        nome: user.nome,
        tipo: user.tipo,
        status: user.status
      });
    } catch (error) {
      console.error('Erro na criação do usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          username: true,
          nome: true,
          tipo: true,
          status: true,
          quant_acesso: true
        }
      });

      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { status } = req.body;

      if (!['A', 'I', 'B'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await prisma.user.update({
        where: { username },
        data: { status }
      });

      return res.json({ message: 'Status do usuário atualizado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const username = req.user?.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
      }

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { username },
        data: { password: hashedPassword }
      });

      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro na alteração de senha:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new UserController();
