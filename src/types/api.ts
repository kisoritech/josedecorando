/**
 * Tipos de dados para a API JDE
 */

// ===== AUTENTICAÇÃO =====
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
  perfil?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ===== USUÁRIO =====
export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

// ===== CLIENTE =====
export interface Cliente {
  id: number;
  tipo_pessoa: 'fisica' | 'juridica';
  nome: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  data_criacao?: string;
}

export interface ClienteForm {
  tipo_pessoa: 'fisica' | 'juridica';
  nome: string;
  email?: string;
  telefone?: string;
}

// ===== PRODUTO =====
export interface Produto {
  id: number;
  nome: string;
  preco_venda: number | string;
  preco_custo: number | string;
  quantidade: number;
  tipo: 'venda' | 'aluguel' | 'ambos';
  ativo: boolean;
  data_criacao?: string;
}

export interface ProdutoForm {
  nome: string;
  preco_venda: number | string;
  preco_custo: number | string;
  quantidade?: number;
  tipo?: 'venda' | 'aluguel' | 'ambos';
}

// ===== VENDA =====
export interface VendaItem {
  produto_id: number;
  quantidade: number;
  valor_unitario: number | string;
}

export interface Venda {
  id: number;
  usuario_id: number;
  cliente_id: number;
  valor_total: string;
  frete_valor?: string;
  total_final?: string;
  forma_pagamento: string;
  status: 'concluida' | 'cancelada';
  data?: string;
  cliente_nome?: string;
  vendedor?: string;
}

export interface VendaForm {
  cliente_id: number;
  forma_pagamento: 'Dinheiro' | 'PIX' | 'Cartão';
  frete_valor?: string;
  itens: VendaItem[];
}

// ===== LOCAÇÃO =====
export interface LocacaoItem {
  id?: number;
  locacao_id?: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: string | number;
  valor_total?: string | number;
}

export interface Locacao {
  id: number;
  produto_id: number;
  produto_nome?: string;
  cliente_id: number;
  cliente_nome?: string;
  quantidade: number;
  valor_unitario: string;
  valor_total?: string;
  status: 'ativa' | 'devolvida' | 'cancelada' | 'atrasada';
  data_inicio: string;
  data_prevista_devolucao: string;
  data_devolucao?: string;
  itens?: LocacaoItem[];
  observacao?: string;
}

export interface LocacaoForm {
  produto_id: number;
  cliente_id: number;
  quantidade: number;
  valor_unitario: string | number;
  data_inicio: string;
  data_prevista_devolucao: string;
  observacao?: string;
}

export interface LocacaoStatusUpdate {
  status: 'ativa' | 'devolvida' | 'cancelada' | 'atrasada';
  nova_data_prevista_devolucao?: string;
  motivo?: string;
}

// ===== MOVIMENTAÇÃO =====
export interface Movimento {
  id?: number;
  produto_id: number;
  produto_nome?: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  valor_unitario?: number | string;
  data: string;
  observacao?: string;
  origem?: string;
}

// ===== TRANSAÇÃO =====
export interface Transacao {
  id: number;
  produto_id: number;
  usuario_id: number;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  valor_unitario: number | string;
  origem: string;
  referencia_id?: number;
  observacao?: string;
  data_criacao: string;
}

// ===== FINANCEIRO =====
export interface FinanceiroCliente {
  id: number;
  cliente_id: number;
  origem: 'venda' | 'locacao';
  referencia_id: number;
  valor_debito: string;
  valor_credito: string;
  status: 'pendente' | 'pago' | 'cancelado';
  data_vencimento: string;
  data_pagamento?: string;
}

// ===== DASHBOARD =====
export interface DashboardResumo {
  total_clientes: string;
  total_produtos: string;
  produtos_disponiveis: string;
  faturamento_total: string;
  total_pix: string;
  total_dinheiro: string;
  locacoes_ativas: string;
}

export interface RelatorioVendas {
  resumo?: {
    total_vendas: string;
    faturamento_total: string;
    subtotal_produtos: string;
    total_frete: string;
    ticket_medio: string;
  };
  por_forma_pagamento?: any[];
  vendas?: Venda[];
}

export interface RelatorioLocacoes {
  resumo?: {
    total_locacoes: string;
    valor_total_locado: string;
    ativas: string;
    atrasadas: string;
    devolvidas: string;
    canceladas: string;
  };
  por_status?: any[];
  locacoes?: Locacao[];
}

export interface RelatorioProdutos {
  resumo?: {
    total_produtos: string;
    estoque_valor_total: string;
  };
  produtos?: Produto[];
}

export interface RelatorioFinanceiro {
  resumo?: {
    total_lancamentos: string;
    total_debitos: string;
    total_creditos: string;
    total_pendente: string;
    total_pago: string;
    total_cancelado: string;
  };
  por_origem?: any[];
  por_cliente?: any[];
  ultimos_lancamentos?: FinanceiroCliente[];
  analise_pix?: any;
  analise_dinheiro?: any;
  comparacao_metodos?: any;
  fluxo_caixa_diario?: any[];
}

// ===== AUDITORIA =====
export interface AuditoriaIntegracao {
  vendas_sem_itens: string;
  vendas_sem_financeiro: string;
  vendas_sem_transacao: string;
  locacoes_sem_itens: string;
  locacoes_sem_financeiro: string;
  locacoes_sem_transacao: string;
  financeiro_sem_cliente: string;
  transacoes_sem_produto: string;
  produtos_estoque_negativo: string;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  response?: any;
}
