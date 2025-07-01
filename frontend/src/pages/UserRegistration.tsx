import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UserRegistration: React.FC = () => {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nome: '',
    tipo: '1'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/users', formData);
      setMessage('Usuário criado com sucesso!');
      setFormData({
        username: '',
        password: '',
        nome: '',
        tipo: '1'
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-registration-container">
      <h2>Cadastrar Novo Usuário</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            maxLength={30}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            required
            maxLength={120}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Usuário</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="0">Administrador</option>
            <option value="1">Usuário Comum</option>
          </select>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;
