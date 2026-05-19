import React, { createContext, ReactNode, useEffect, useState } from 'react';
import api from '../api/api';

// Dashboard Data
export interface DashboardData {
  total_clientes: string;
  total_produtos: string;
  produtos_disponiveis: string;
  faturamento_total: string;
  total_pix: string;
  total_dinheiro: string;
  locacoes_ativas: string;
}

// Product
export interface Product {
  id: number;
  nome: string;
  preco_venda: number | string;
  preco_custo: number | string;
  quantidade: number;
  tipo: string;
  ativo: boolean;
}

// Movement
export interface Movement {
  id?: number;
  produto_nome?: string;
  produto_id?: number;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  valor_unitario?: number | string;
  data: string;
  observacao?: string;
  origem?: string;
}

// Report Data
export interface ReportData {
  financeiro: {
    resumo?: {
      total_lancamentos: string;
      total_debitos: string;
      total_creditos: string;
      total_pago: string;
      total_pendente: string;
    };
  };
  vendas: {
    resumo?: {
      total_vendas: string;
      faturamento_total: string;
      ticket_medio: string;
    };
  };
  locacoes: {
    resumo?: {
      total_locacoes: string;
      ativas: string;
      atrasadas: string;
      devolvidas: string;
    };
  };
  produtos: {
    resumo?: {
      total_produtos: string;
      estoque_valor_total: string;
    };
  };
}

export interface DataContextType {
  // Dashboard
  dashboard: DashboardData | null;
  loadDashboard: () => Promise<void>;
  dashboardLoading: boolean;
  dashboardError: string | null;

  // Products
  products: Product[];
  loadProducts: () => Promise<void>;
  productsLoading: boolean;
  productsError: string | null;

  // Movements
  movements: Movement[];
  loadMovements: () => Promise<void>;
  movementsLoading: boolean;
  movementsError: string | null;

  // Reports
  reports: ReportData;
  loadReports: () => Promise<void>;
  reportsLoading: boolean;
  reportsError: string | null;

  // General
  isRefreshing: boolean;
  refreshAllData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Dashboard State
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Movements State
  const [movements, setMovements] = useState<Movement[]>([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementsError, setMovementsError] = useState<string | null>(null);

  // Reports State
  const [reports, setReports] = useState<ReportData>({
    financeiro: {},
    vendas: {},
    locacoes: {},
    produtos: {},
  });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // General
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load Dashboard
  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);
      setDashboardError(null);
      const response = await api.get('/api/dashboard/resumo');
      setDashboard(response.data);
      console.log('[Data] Dashboard carregado com sucesso');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar dashboard';
      setDashboardError(errorMessage);
      console.error('[Data] Erro ao carregar dashboard:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Load Products
  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const response = await api.get('/api/produtos');
      setProducts(response.data || []);
      console.log('[Data] Produtos carregados com sucesso');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar produtos';
      setProductsError(errorMessage);
      console.error('[Data] Erro ao carregar produtos:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load Movements
  const loadMovements = async () => {
    try {
      setMovementsLoading(true);
      setMovementsError(null);
      const response = await api.get('/api/dashboard/movimentacao-geral');
      setMovements(response.data || []);
      console.log('[Data] Movimentações carregadas com sucesso');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar movimentações';
      setMovementsError(errorMessage);
      console.error('[Data] Erro ao carregar movimentações:', err);
    } finally {
      setMovementsLoading(false);
    }
  };

  // Load Reports
  const loadReports = async () => {
    try {
      setReportsLoading(true);
      setReportsError(null);

      const [fin, ven, loc, prod] = await Promise.all([
        api.get('/api/dashboard/financeiro-completo'),
        api.get('/api/dashboard/vendas-relatorio'),
        api.get('/api/dashboard/locacoes-relatorio'),
        api.get('/api/dashboard/produtos-relatorio'),
      ]);

      setReports({
        financeiro: fin.data,
        vendas: ven.data,
        locacoes: loc.data,
        produtos: prod.data,
      });
      console.log('[Data] Relatórios carregados com sucesso');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar relatórios';
      setReportsError(errorMessage);
      console.error('[Data] Erro ao carregar relatórios:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([loadDashboard(), loadProducts(), loadMovements(), loadReports()]);
      console.log('[Data] Todos os dados atualizados com sucesso');
    } catch (err) {
      console.error('[Data] Erro ao atualizar dados:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load initial data when context is ready
  useEffect(() => {
    console.log('[Data] Inicializando DataContext, carregando dados iniciais...');
    refreshAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        dashboard,
        loadDashboard,
        dashboardLoading,
        dashboardError,
        products,
        loadProducts,
        productsLoading,
        productsError,
        movements,
        loadMovements,
        movementsLoading,
        movementsError,
        reports,
        loadReports,
        reportsLoading,
        reportsError,
        isRefreshing,
        refreshAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
