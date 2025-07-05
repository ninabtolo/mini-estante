import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

// Em uma implementação real, o sistema enviaria um email com um link para redefinir a senha
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Esta função seria responsável por enviar a solicitação de recuperação de senha para o backend
  // O backend verificaria o email, geraria um token único e enviaria um email com um link contendo esse token
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Por favor, informe seu email');
      return;
    }

    // Validação básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um email válido');
      return;
    }

    setLoading(true);

    try {
      // Simulação da chamada à API - em uma implementação real, isso chamaria o endpoint
      // /api/forgot-password para solicitar a recuperação de senha
      // await api.post('/forgot-password', { email });
      
      // Como é uma simulação, apenas mostramos uma mensagem de sucesso após um pequeno delay
      setTimeout(() => {
        setMessage('Se este email estiver associado a uma conta, enviaremos instruções para redefinir sua senha.');
        setEmailSent(true);
        setEmail('');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h1 className="login-title">Recuperar Senha</h1>
        
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
              />
            </div>
            
            <Button 
              type="submit" 
              isLoading={loading}
              className="w-100 mt-4"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        ) : (
          <div className="success-message text-center">
            {message}
          </div>
        )}
        
        <div className="back-to-login mt-12 text-center">
          <Link to="/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
