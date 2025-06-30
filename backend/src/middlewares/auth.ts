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
    return res.status(401).json({ error: 'Token not provided' });
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
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (user.status === 'B') {
      return res.status(403).json({ error: 'User is blocked' });
    }

    if (user.status === 'I') {
      return res.status(403).json({ error: 'User is inactive' });
    }

    req.user = {
      id: decoded.id,
      tipo: decoded.tipo
    };

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.tipo !== '0') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  return next();
};
