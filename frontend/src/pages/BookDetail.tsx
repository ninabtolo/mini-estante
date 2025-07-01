import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get<Book>(`/books/${id}`);
        setBook(response.data);
      } catch (err: any) {
        setError('Erro ao carregar livro: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }
    
    try {
      await api.delete(`/books/${id}`);
      navigate('/books');
    } catch (err: any) {
      alert('Erro ao excluir livro: ' + (err.response?.data?.error || err.message));
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!book) {
    return <div>Livro não encontrado</div>;
  }
  
  return (
    <div className="book-detail-container">
      <h2>{book.titulo}</h2>
      
      <div className="book-info">
        <p><strong>Autor:</strong> {book.autor}</p>
        <p><strong>Data de Leitura:</strong> {formatDate(book.data_leitura)}</p>
        <p><strong>Avaliação:</strong> {book.avaliacao ? `${book.avaliacao}/5` : 'Não avaliado'}</p>
        
        {book.resenha && (
          <div className="book-review">
            <h3>Resenha</h3>
            <p>{book.resenha}</p>
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <Link to="/books" className="back-button">Voltar para a Lista</Link>
        <Link to={`/books/edit/${book.id}`} className="edit-button">Editar</Link>
        <button onClick={handleDelete} className="delete-button">Excluir</button>
      </div>
    </div>
  );
};

export default BookDetail;
