import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/dashboard" className="header-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Mini Estante
        </Link>
        
        {user && (
          <div className="user-info">
            <span className="user-greeting">Olá, {user.nome}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
