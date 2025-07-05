import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

// Esta página é acessada quando o usuário clica no link enviado por email
// O token é passado como parâmetro na URL para validar a solicitação
const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // Em uma implementação real, este useEffect verificaria se o token é válido
  // fazendo uma chamada para o backend
  useEffect(() => {
    // Simulação de verificação de token
    const validateToken = async () => {
      try {
        // Simular chamada à API para validar o token
        // Na implementação real, faríamos: await api.get(`/reset-password/validate/${token}`);
        
        // Simulação: assumimos que o token é válido após um delay
        setTimeout(() => {
          setValidToken(true);
          setValidating(false);
        }, 1000);
      } catch (err) {
        setError('Token inválido ou expirado');
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Esta função seria responsável por enviar a nova senha para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Simulação da chamada à API - em uma implementação real, isso chamaria
      // o endpoint /api/reset-password para redefinir a senha
      // await api.post(`/reset-password/${token}`, { password: newPassword });
      
      // Como é uma simulação, apenas mostramos uma mensagem de sucesso após um pequeno delay
      setTimeout(() => {
        setMessage('Senha redefinida com sucesso! Você será redirecionado para a página de login.');
        
        // Redirecionamento para login após alguns segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="login-container">
        <div className="login-card fade-in">
          <h1 className="login-title">Redefinir Senha</h1>
          <div className="text-center">
            <p>Validando seu token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="login-container">
        <div className="login-card fade-in">
          <h1 className="login-title">Redefinir Senha</h1>
          <div className="error-message">
            <p>O link de redefinição de senha é inválido ou expirou.</p>
            <p>Por favor, solicite um novo link de redefinição.</p>
          </div>
          <div className="back-to-login mt-8 text-center">
            <Link to="/forgot-password">Solicitar novo link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h1 className="login-title">Redefinir Senha</h1>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              disabled={!!message}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              disabled={!!message}
            />
          </div>
          
          <Button 
            type="submit" 
            isLoading={loading}
            className="w-100 mt-4"
            disabled={!!message}
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>
        </form>
        
        <div className="back-to-login mt-8 text-center">
          <Link to="/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
