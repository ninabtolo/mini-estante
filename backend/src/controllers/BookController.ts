import { Request, Response } from 'express';
import prisma from '../lib/prisma';

class BookController {
  async index(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { tipo } = req.user!;
      
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 7);
      const skip = (page - 1) * limit;
      
      let whereClause = {};
      
      if (tipo === '0' && req.query.userId) {
        whereClause = { userId: String(req.query.userId) };
      } else {
        whereClause = { userId };
      }
      
      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where: whereClause,
          orderBy: { data_leitura: 'desc' },
          skip,
          take: limit
        }),
        prisma.book.count({
          where: whereClause
        })
      ]);
      
      return res.json({
        books,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, tipo } = req.user!;
      
      const book = await prisma.book.findUnique({
        where: { id: Number(id) }
      });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      
      return res.json(book);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { titulo, autor, data_leitura, avaliacao, resenha } = req.body;
      
      if (!titulo || !autor || !data_leitura) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }
      
      if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
        return res.status(400).json({ error: 'Avaliação deve estar entre 1 e 5' });
      }
      
      const book = await prisma.book.create({
        data: {
          titulo,
          autor,
          data_leitura: new Date(data_leitura),
          avaliacao: avaliacao || null,
          resenha: resenha || null,
          userId
        }
      });
      
      return res.status(201).json(book);
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, tipo } = req.user!;
      const { titulo, autor, data_leitura, avaliacao, resenha } = req.body;
      
      const book = await prisma.book.findUnique({
        where: { id: Number(id) }
      });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      
      if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
        return res.status(400).json({ error: 'Avaliação deve estar entre 1 e 5' });
      }
      
      const updatedBook = await prisma.book.update({
        where: { id: Number(id) },
        data: {
          titulo: titulo || book.titulo,
          autor: autor || book.autor,
          data_leitura: data_leitura ? new Date(data_leitura) : book.data_leitura,
          avaliacao: avaliacao !== undefined ? avaliacao : book.avaliacao,
          resenha: resenha !== undefined ? resenha : book.resenha
        }
      });
      
      return res.json(updatedBook);
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, tipo } = req.user!;
      
      const book = await prisma.book.findUnique({
        where: { id: Number(id) }
      });
      
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      
      await prisma.book.delete({
        where: { id: Number(id) }
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new BookController();
