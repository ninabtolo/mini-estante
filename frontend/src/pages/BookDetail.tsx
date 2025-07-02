import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

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
  
  const renderStars = (rating: number | null) => {
    if (!rating) return 'Não avaliado';
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      }
    }
    
    return <div className="rating-stars">{stars}</div>;
  };
  
  return (
    <div>
      <Header />
      
      <div className="page-container">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : book ? (
          <div className="book-detail-container fade-in">
            <h2>{book.titulo}</h2>
            
            <div className="book-info">
              <div className="book-info-item">
                <span className="book-info-label">Autor:</span>
                <span>{book.autor}</span>
              </div>
              
              <div className="book-info-item">
                <span className="book-info-label">Data de Leitura:</span>
                <span>{formatDate(book.data_leitura)}</span>
              </div>
              
              <div className="book-info-item">
                <span className="book-info-label">Avaliação:</span>
                <span>{renderStars(book.avaliacao)}</span>
              </div>
              
              {book.resenha && (
                <div className="book-review">
                  <h3>Resenha</h3>
                  <p>{book.resenha}</p>
                </div>
              )}
            </div>
            
            <div className="action-buttons">
              <Link to="/books" className="btn btn-outline">
                Voltar para a Lista
              </Link>
              <Link to={`/books/edit/${book.id}`} className="btn btn-secondary">
                Editar
              </Link>
              <Button variant="danger" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        ) : (
          <div>Livro não encontrado</div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
