import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Card from '../components/Card';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-container">
      <Header />
      
      <main className="page-container">
        <div className="dashboard-header fade-in">
          <h2>Dashboard</h2>
          <p>Bem-vindo à sua Mini Estante, gerencie suas leituras em um só lugar.</p>
        </div>
        
        <div className="dashboard-cards fade-in">
          <Card className="dashboard-card">
            <div className="dashboard-card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Meus Livros
            </div>
            <p className="dashboard-card-content">
              Gerencie sua coleção de livros, adicione novos títulos e registre suas impressões.
            </p>
            <Link to="/books" className="btn btn-primary">
              Ver Meus Livros
            </Link>
          </Card>
          
          <Card className="dashboard-card">
            <div className="dashboard-card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Segurança
            </div>
            <p className="dashboard-card-content">
              Altere sua senha para manter sua conta segura.
            </p>
            <Link to="/change-password" className="btn btn-primary">
              Alterar Senha
            </Link>
          </Card>
          
          {isAdmin && (
            <Card className="dashboard-card">
              <div className="dashboard-card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Administração
              </div>
              <p className="dashboard-card-content">
                Como administrador, você pode gerenciar usuários e ter acesso a todas as funcionalidades.
              </p>
              <Link to="/register-user" className="btn btn-primary">
                Cadastrar Novo Usuário
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
