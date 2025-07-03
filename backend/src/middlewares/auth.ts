import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

interface TokenPayload {
  id: string;
  tipo: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        tipo: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { username: decoded.id.trim() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (user.status === 'B') {
      return res.status(403).json({ error: 'Usuário está bloqueado' });
    }

    if (user.status === 'I') {
      return res.status(403).json({ error: 'Usuário está inativo' });
    }

    req.user = {
      id: decoded.id,
      userId: user.username, // Adicionando o username como userId
      tipo: decoded.tipo
    };

    return next();
  } catch (err) {
    console.error('Erro no middleware de autenticação:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.tipo !== '0') {
    return res.status(403).json({ error: 'Permissão negada' });
  }

  return next();
};
