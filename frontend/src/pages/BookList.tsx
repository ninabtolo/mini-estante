import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';

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
  
  if (loading) {
    return <div>Carregando livros...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2>Meus Livros</h2>
        <Link to="/books/new" className="add-button">Adicionar Livro</Link>
      </div>
      
      {books.length === 0 ? (
        <p>Você ainda não tem livros registrados.</p>
      ) : (
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
              <tr key={book.id}>
                <td>{book.titulo}</td>
                <td>{book.autor}</td>
                <td>{formatDate(book.data_leitura)}</td>
                <td>{book.avaliacao ? `${book.avaliacao}/5` : 'N/A'}</td>
                <td>
                  <Link to={`/books/${book.id}`} className="view-button">Ver</Link>
                  <Link to={`/books/edit/${book.id}`} className="edit-button">Editar</Link>
                  <button 
                    onClick={() => handleDelete(book.id)} 
                    className="delete-button"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;
