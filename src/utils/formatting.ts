/**
 * Formata um valor numérico como moeda brasileira
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (!value && value !== 0) return 'R$ 0,00';

  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;

  if (isNaN(numValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

/**
 * Formata uma data para padrão brasileiro DD/MM/YYYY
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleString('pt-BR');
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Remove máscara de telefone
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Formata telefone para exibição
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length !== 11) return phone;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

/**
 * Converte string de valor monetário para número
 * Aceita "R$ 100,00" ou "100,00" ou "100.00"
 */
export const parseMoneyValue = (value: string): number => {
  if (!value) return 0;

  // Remove "R$" e espaços
  let cleaned = value.replace(/[R$\s]/g, '');

  // Se tem ponto e vírgula, assume formato brasileiro
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Gera ID aleatório (para mock data)
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
