import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <div className="dashboard-container">
      <header>
        <h1>Mini Estante</h1>
        <div className="user-info">
          <span>Olá, {user.nome}</span>
          <button onClick={signOut}>Sair</button>
        </div>
      </header>

      <main>
        <h2>Dashboard</h2>
        
        {isAdmin && (
          <div className="admin-panel">
            <h3>Painel de Administração</h3>
            <p>Como administrador, você pode gerenciar usuários e ter acesso a todas as funcionalidades.</p>
            <Link to="/register-user" className="admin-button">Cadastrar Novo Usuário</Link>
          </div>
        )}
        
        <div className="user-books">
          <h3>Meus Livros</h3>
          {/* User's books would be displayed here */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
