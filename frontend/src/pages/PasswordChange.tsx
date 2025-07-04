import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';

const PasswordChange: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('As novas senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setMessage(response.data.message || 'Senha alterada com sucesso!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      
      <div className="page-container">
        <h2 className="page-title">Meu Perfil</h2>
        
        <div className="user-profile-container fade-in">
          <div className="profile-content">
            <div className="user-info-card">
              <h3 className="user-info-title">Informações do Usuário</h3>
              <div className="user-info-content">
                <p><strong>Nome de usuário:</strong> {user?.username}</p>
                <p><strong>Nome completo:</strong> {user?.nome}</p>
                <p><strong>Quantidade de acessos:</strong> {user?.quant_acesso || 0}</p>
                <p><strong>Tipo de usuário:</strong> {user?.tipo === '0' ? 'Administrador' : 'Usuário comum'}</p>
              </div>
            </div>
            
            <div className="password-form-container">
              <h3 className="form-title">Alterar Senha</h3>
              
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Senha Atual</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Digite sua senha atual"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nova Senha</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Digite a nova senha"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirme a nova senha"
                  />
                </div>
                
                <div className="form-buttons">
                  <Button 
                    type="submit" 
                    isLoading={loading}
                  >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
