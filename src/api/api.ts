import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configuração da API
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10);
const DEBUG_MODE = process.env.EXPO_PUBLIC_DEBUG === 'true';

console.log('[API Config] URL:', API_URL);
console.log('[API Config] Timeout:', API_TIMEOUT, 'ms');
console.log('[API Config] Debug Mode:', DEBUG_MODE);

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - Adiciona token ao header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (DEBUG_MODE) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        if (token) {
          console.log('[API Request] Token presente no header');
        }
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('[API Error] Erro ao recuperar token:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('[API Error] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    if (DEBUG_MODE) {
      console.log(`[API Response] ${response.status} - ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (DEBUG_MODE) {
      console.error('[API Error] Detalhes:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Se receber 401 (não autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('[API Auth] Token expirado ou inválido, fazendo logout...');
        // Limpa o token inválido
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        
        // Força logout redirecionando para login
        // Isso será tratado no contexto de autenticação
        return Promise.reject(error);
      } catch (logoutError) {
        console.error('[API Auth] Erro ao fazer logout:', logoutError);
        return Promise.reject(logoutError);
      }
    }

    // Log de erro detalhado em desenvolvimento
    if (DEBUG_MODE) {
      console.error('[API Error] Resposta completa do erro:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para logging
export function logApiError(error: unknown, context: string): void {
  if (axios.isAxiosError(error)) {
    console.error(`[${context}] Erro na API:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      url: error.config?.url,
    });
  } else {
    console.error(`[${context}] Erro desconhecido:`, error);
  }
}

export default api;
