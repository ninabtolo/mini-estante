import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Book } from '../types';

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    data_leitura: '',
    avaliacao: '',
    resenha: ''
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      const fetchBook = async () => {
        try {
          const response = await api.get<Book>(`/books/${id}`);
          const book = response.data;
          
          const date = new Date(book.data_leitura);
          const formattedDate = date.toISOString().split('T')[0];
          
          setFormData({
            titulo: book.titulo,
            autor: book.autor,
            data_leitura: formattedDate,
            avaliacao: book.avaliacao ? book.avaliacao.toString() : '',
            resenha: book.resenha || ''
          });
        } catch (err: any) {
          setError('Erro ao carregar livro: ' + (err.response?.data?.error || err.message));
        } finally {
          setLoading(false);
        }
      };
      
      fetchBook();
    }
  }, [id, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const bookData = {
        titulo: formData.titulo,
        autor: formData.autor,
        data_leitura: formData.data_leitura,
        avaliacao: formData.avaliacao ? Number(formData.avaliacao) : null,
        resenha: formData.resenha || null
      };
      
      if (isEditing) {
        await api.put(`/books/${id}`, bookData);
      } else {
        await api.post('/books', bookData);
      }
      
      navigate('/books');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar livro');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="book-form-container">
      <h2>{isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="autor">Autor</label>
          <input
            id="autor"
            name="autor"
            type="text"
            value={formData.autor}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="data_leitura">Data de Leitura</label>
          <input
            id="data_leitura"
            name="data_leitura"
            type="date"
            value={formData.data_leitura}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="avaliacao">Avaliação</label>
          <select
            id="avaliacao"
            name="avaliacao"
            value={formData.avaliacao}
            onChange={handleChange}
          >
            <option value="">Selecione uma avaliação</option>
            <option value="1">1 - Muito ruim</option>
            <option value="2">2 - Ruim</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bom</option>
            <option value="5">5 - Excelente</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="resenha">Resenha</label>
          <textarea
            id="resenha"
            name="resenha"
            value={formData.resenha}
            onChange={handleChange}
            rows={5}
          />
        </div>
        
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/books')} className="cancel-button">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="submit-button">
            {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
