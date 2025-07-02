import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (err: any) {
        setError('Erro ao carregar livros: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }
    
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err: any) {
      alert('Erro ao excluir livro: ' + (err.response?.data?.error || err.message));
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  return (
    <div>
      <Header />
      
      <div className="page-container">
        <div className="list-header fade-in">
          <h2>Meus Livros</h2>
          <Link to="/books/new" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Livro
          </Link>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-message fade-in">{error}</div>
        ) : books.length === 0 ? (
          <div className="empty-state fade-in">
            <p>Você ainda não tem livros registrados.</p>
            <Link to="/books/new" className="btn btn-primary mt-4">
              Adicionar Meu Primeiro Livro
            </Link>
          </div>
        ) : (
          <div className="fade-in">
            <div className="book-table-container">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Data de Leitura</th>
                    <th>Avaliação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} className="book-row">
                      <td>{book.titulo}</td>
                      <td>{book.autor}</td>
                      <td>{formatDate(book.data_leitura)}</td>
                      <td>{book.avaliacao ? `${book.avaliacao}/5` : 'N/A'}</td>
                      <td>
                        <div className="table-actions">
                          <Link to={`/books/${book.id}`} className="btn btn-outline btn-sm">
                            Ver
                          </Link>
                          <Link to={`/books/edit/${book.id}`} className="btn btn-secondary btn-sm">
                            Editar
                          </Link>
                          <Button 
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(book.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
