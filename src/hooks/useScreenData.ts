import { useCallback } from 'react';
import { useData } from '../context/DataContext';

/**
 * Hook customizado para facilitar o carregamento e gerenciamento de dados nas telas
 * Fornece métodos para recarregar dados e acessar estado de loading/erro
 */
export const useScreenData = (screenType: 'dashboard' | 'products' | 'movements' | 'reports' = 'dashboard') => {
  const data = useData();

  const reload = useCallback(() => {
    switch (screenType) {
      case 'dashboard':
        return data.loadDashboard();
      case 'products':
        return data.loadProducts();
      case 'movements':
        return data.loadMovements();
      case 'reports':
        return data.loadReports();
      default:
        return data.refreshAllData();
    }
  }, [screenType, data]);

  const getScreenData = () => {
    switch (screenType) {
      case 'dashboard':
        return {
          data: data.dashboard,
          loading: data.dashboardLoading,
          error: data.dashboardError,
          reload,
        };
      case 'products':
        return {
          data: data.products,
          loading: data.productsLoading,
          error: data.productsError,
          reload,
        };
      case 'movements':
        return {
          data: data.movements,
          loading: data.movementsLoading,
          error: data.movementsError,
          reload,
        };
      case 'reports':
        return {
          data: data.reports,
          loading: data.reportsLoading,
          error: data.reportsError,
          reload,
        };
      default:
        return {
          data: null,
          loading: false,
          error: null,
          reload,
        };
    }
  };

  return {
    ...getScreenData(),
    isRefreshing: data.isRefreshing,
    refreshAll: data.refreshAllData,
  };
};

/**
 * Hook para pré-carregar dados de uma tela específica
 * Útil quando você sabe que uma tela será renderizada em breve
 */
export const usePreloadData = (screenType: 'dashboard' | 'products' | 'movements' | 'reports') => {
  const data = useData();

  const preload = useCallback(() => {
    switch (screenType) {
      case 'dashboard':
        return data.loadDashboard();
      case 'products':
        return data.loadProducts();
      case 'movements':
        return data.loadMovements();
      case 'reports':
        return data.loadReports();
    }
  }, [screenType, data]);

  return { preload };
};
