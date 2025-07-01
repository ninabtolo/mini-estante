import { Request, Response } from 'express';
import prisma from '../lib/prisma';

class BookController {
  async index(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { tipo } = req.user!;
      
      if (tipo === '0' && req.query.userId) {
        const books = await prisma.book.findMany({
          where: { userId: String(req.query.userId) },
          orderBy: { data_leitura: 'desc' }
        });
        return res.json(books);
      }
      
      const books = await prisma.book.findMany({
        where: { userId },
        orderBy: { data_leitura: 'desc' }
      });
      
      return res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
        return res.status(404).json({ error: 'Book not found' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permission denied' });
      }
      
      return res.json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { userId } = req.user!;
      const { titulo, autor, data_leitura, avaliacao, resenha } = req.body;
      
      if (!titulo || !autor || !data_leitura) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
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
      console.error('Error creating book:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
        return res.status(404).json({ error: 'Book not found' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permission denied' });
      }
      
      if (avaliacao && (avaliacao < 1 || avaliacao > 5)) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
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
      console.error('Error updating book:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
        return res.status(404).json({ error: 'Book not found' });
      }
      
      if (book.userId !== userId && tipo !== '0') {
        return res.status(403).json({ error: 'Permission denied' });
      }
      
      await prisma.book.delete({
        where: { id: Number(id) }
      });
      
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting book:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new BookController();
