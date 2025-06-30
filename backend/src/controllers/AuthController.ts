import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // tive q fazer trim no username para evitar problemas com espaços em branco
      const trimmedUsername = username.trim();

      const user = await prisma.user.findUnique({ 
        where: { username: trimmedUsername } 
      });

      if (!user) {
        console.log(`Login failed: User ${trimmedUsername} not found`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (user.status === 'B') {
        return res.status(403).json({ error: 'User is blocked' });
      }

      if (user.status === 'I') {
        return res.status(403).json({ error: 'User is inactive' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        console.log(`Login failed: Password mismatch for user ${trimmedUsername}`);
      
        const failedAttempts = user.failed_attempts + 1;
        
        if (failedAttempts >= 3) {
          await prisma.user.update({
            where: { username: trimmedUsername },
            data: {
              status: 'B',
              failed_attempts: failedAttempts
            }
          });
          return res.status(403).json({ error: 'User blocked due to multiple failed attempts' });
        }
        
        await prisma.user.update({
          where: { username: trimmedUsername },
          data: { failed_attempts: failedAttempts }
        });
        
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      await prisma.user.update({
        where: { username: trimmedUsername },
        data: {
          failed_attempts: 0,
          quant_acesso: user.quant_acesso + 1
        }
      });

      const token = jwt.sign(
        { id: user.username, tipo: user.tipo },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '8h' }
      );

      return res.json({
        user: {
          username: user.username,
          nome: user.nome,
          tipo: user.tipo
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async logout(req: Request, res: Response) {
    return res.status(204).send();
  }
}

export default new AuthController();
