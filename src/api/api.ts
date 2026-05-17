import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000'),
});

// Interceptor de requisição - Adiciona token ao header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 (não autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Limpa o token inválido
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        
        // Força logout redirecionando para login
        // Isso será tratado no contexto de autenticação
        return Promise.reject(error);
      } catch (logoutError) {
        console.error('Erro ao fazer logout:', logoutError);
      }
    }

    // Log de erro detalhado em desenvolvimento
    if (process.env.EXPO_PUBLIC_DEBUG === 'true') {
      console.error('Erro na API:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
