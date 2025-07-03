import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  username: string;
  nome: string;
  tipo: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: User;
  isAdmin: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@MiniEstante:token');
    const user = localStorage.getItem('@MiniEstante:user');

    if (token && user) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async ({ username, password }: SignInCredentials) => {
    try {
      const response = await api.post('/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@MiniEstante:token', token);
      localStorage.setItem('@MiniEstante:user', JSON.stringify(user));

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setData({ token, user });
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@MiniEstante:token');
    localStorage.removeItem('@MiniEstante:user');

    setData({} as AuthState);
  };

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        isAdmin: data.user?.tipo === '0',
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }

  return context;
}
