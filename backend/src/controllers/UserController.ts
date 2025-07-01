import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

class UserController {
  async create(req: Request, res: Response) {
    try {
      let { username, password, nome, tipo } = req.body;

      if (!username || !password || !nome || !tipo) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      username = username.trim();
      nome = nome.trim();
      tipo = tipo.trim();
      
      if (username.length > 30) {
        return res.status(400).json({ error: 'Username must be 30 characters or less' });
      }

      if (nome.length > 120) {
        return res.status(400).json({ error: 'Name must be 120 characters or less' });
      }

      const userExists = await prisma.user.findUnique({
        where: { username }
      });

      if (userExists) {
        return res.status(400).json({ error: 'Username already exists' });
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

      console.log(`User created successfully: ${username}`);

      return res.status(201).json({
        username: user.username,
        nome: user.nome,
        tipo: user.tipo,
        status: user.status
      });
    } catch (error) {
      console.error('User creation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const { status } = req.body;

      if (!['A', 'I', 'B'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await prisma.user.update({
        where: { username },
        data: { status }
      });

      return res.json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
