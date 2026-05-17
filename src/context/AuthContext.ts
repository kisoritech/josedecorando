import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nome: string, email: string, password: string, perfil?: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega usuário ao inicializar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('auth_token');
      const savedUser = await AsyncStorage.getItem('user_data');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        // Valida token com a API
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        } catch (apiError) {
          // Token inválido, limpa dados
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          setToken(null);
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      // Salva token e usuário
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao fazer login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome: string, email: string, password: string, perfil = 'vendedor') => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/register', {
        nome,
        email,
        password,
        perfil,
      });

      const { token: newToken, user: userData } = response.data;

      // Salva token e usuário
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Falha ao registrar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook customizado para usar o contexto de autenticação
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

