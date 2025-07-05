import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 7;
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/books', {
          params: {
            page: currentPage,
            limit: booksPerPage
          }
        });
        
        setBooks(response.data.books);
        setTotalPages(response.data.totalPages);
        setTotalBooks(response.data.total);
      } catch (err: any) {
        setError('Erro ao carregar livros: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [currentPage]);
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }
    
    try {
      await api.delete(`/books/${id}`);
      
      const response = await api.get('/books', {
        params: {
          page: currentPage,
          limit: booksPerPage
        }
      });
      
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
      setTotalBooks(response.data.total);

      if (response.data.books.length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err: any) {
      alert('Erro ao excluir livro: ' + (err.response?.data?.error || err.message));
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={goToPreviousPage} 
          disabled={currentPage === 1}
          className="pagination-button"
          style={{ margin: '0 4px', padding: '6px 12px', borderRadius: '4px' }}
        >
          &laquo;
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              onClick={() => goToPage(1)} 
              className="pagination-button"
              style={{ margin: '0 4px', padding: '6px 12px', borderRadius: '4px' }}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis" style={{ margin: '0 4px' }}>...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => goToPage(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            style={{ 
              margin: '0 4px', 
              padding: '6px 12px', 
              borderRadius: '4px',
              backgroundColor: currentPage === number ? '#6366f1' : '',
              color: currentPage === number ? 'white' : ''
            }}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis" style={{ margin: '0 4px' }}>...</span>}
            <button 
              onClick={() => goToPage(totalPages)} 
              className="pagination-button"
              style={{ margin: '0 4px', padding: '6px 12px', borderRadius: '4px' }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          onClick={goToNextPage} 
          disabled={currentPage === totalPages}
          className="pagination-button"
          style={{ margin: '0 4px', padding: '6px 12px', borderRadius: '4px' }}
        >
          &raquo;
        </button>
      </div>
    );
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
        ) : books.length === 0 && currentPage === 1 ? (
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
                      <td>{book.avaliacao ? `${book.avaliacao}/5` : 'Não avaliado'}</td>
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
            
            {totalBooks > 0 && (
              <div className="pagination-container" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div className="books-info">
                  Mostrando {((currentPage - 1) * booksPerPage) + 1} a {Math.min(currentPage * booksPerPage, totalBooks)} de {totalBooks} livro(s)
                </div>
                <Pagination />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
