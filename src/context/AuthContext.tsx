import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import api, { logApiError } from '../api/api';

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

  const getApiErrorMessage = (err: any, fallback: string) => {
    return err.response?.data?.message || err.response?.data?.error || fallback;
  };

  const normalizeAuthResponse = (data: any) => {
    return {
      newToken: data?.token || data?.accessToken,
      userData: data?.user || data?.usuario,
    };
  };

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
          const userData = response.data?.user || response.data?.usuario || response.data;
          setUser(userData);
          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          console.log('[Auth] Usuário carregado com sucesso');
        } catch {
          // Token inválido, limpa dados
          console.warn('[Auth] Token expirado ou inválido');
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('[Auth] Nenhum token salvo, usuário deslogado');
      }
    } catch (err) {
      console.error('[Auth] Erro ao carregar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('[Auth] Iniciando login para:', email);
      
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { newToken, userData } = normalizeAuthResponse(response.data);

      if (!newToken || !userData) {
        throw new Error('Resposta inválida da API: token ou usuário não recebido');
      }

      // Salva token e usuário
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      
      console.log('[Auth] Login realizado com sucesso');
    } catch (err: any) {
      logApiError(err, 'Login');
      
      let errorMessage = 'Falha ao fazer login';
      
      if (err.response?.data?.message || err.response?.data?.error) {
        errorMessage = getApiErrorMessage(err, errorMessage);
      } else if (err.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (err.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Erro de conexão com a API. Verifique sua internet.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Requisição expirou. A API está demorando para responder.';
      }
      
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
      console.log('[Auth] Iniciando registro para:', email);
      
      const response = await api.post('/api/auth/register', {
        nome,
        email,
        password,
        perfil,
      });

      const { newToken, userData } = normalizeAuthResponse(response.data);

      if (!newToken || !userData) {
        throw new Error('Resposta inválida da API: token ou usuário não recebido');
      }

      // Salva token e usuário
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      
      console.log('[Auth] Registro realizado com sucesso');
    } catch (err: any) {
      logApiError(err, 'Register');
      
      let errorMessage = 'Falha ao registrar';
      
      if (err.response?.data?.message || err.response?.data?.error) {
        errorMessage = getApiErrorMessage(err, errorMessage);
      } else if (err.response?.status === 409) {
        errorMessage = 'Email já cadastrado';
      } else if (err.response?.status === 422) {
        errorMessage = 'Dados inválidos. Verifique os campos.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Erro de conexão com a API. Verifique sua internet.';
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[Auth] Realizando logout...');
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
      setError(null);
      console.log('[Auth] Logout realizado com sucesso');
    } catch (err) {
      console.error('[Auth] Erro ao fazer logout:', err);
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

