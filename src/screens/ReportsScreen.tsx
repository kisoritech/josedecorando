import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../api/api';
import { formatCurrency } from '../utils/formatting';

interface ReportData {
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

export default function ReportsScreen() {
  const [reports, setReports] = useState<ReportData>({
    financeiro: {},
    vendas: {},
    locacoes: {},
    produtos: {},
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'financeiro' | 'vendas' | 'locacoes' | 'produtos' | null>(null);

  const loadReports = async () => {
    try {
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
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      Alert.alert('Erro', 'Falha ao carregar relatórios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
      }
    >
      {/* Header */}
      <View className="bg-gradient-to-b from-indigo-600 to-purple-600 pt-12 pb-6 px-6">
        <Text className="text-white text-3xl font-bold">Relatórios</Text>
        <Text className="text-white/80 text-sm">Análise Completa JDE</Text>
      </View>

      {/* Reports Cards */}
      <View className="px-6 py-6 space-y-4">
        {/* Financeiro */}
        <TouchableOpacity
          onPress={() => setSelectedReport(selectedReport === 'financeiro' ? null : 'financeiro')}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-slate-500 text-sm mb-1">💰 Financeiro</Text>
              <Text className="text-3xl font-bold text-emerald-600">
                {formatCurrency(reports.financeiro.resumo?.total_pago || 0)}
              </Text>
            </View>
            <Text className="text-3xl">📊</Text>
          </View>
          <View className="flex-row justify-between text-xs text-slate-600">
            <Text>Débitos: {formatCurrency(reports.financeiro.resumo?.total_debitos || 0)}</Text>
            <Text>Créditos: {formatCurrency(reports.financeiro.resumo?.total_creditos || 0)}</Text>
          </View>
        </TouchableOpacity>

        {/* Vendas */}
        <TouchableOpacity
          onPress={() => setSelectedReport(selectedReport === 'vendas' ? null : 'vendas')}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-slate-500 text-sm mb-1">📦 Vendas</Text>
              <Text className="text-3xl font-bold text-blue-600">
                {reports.vendas.resumo?.total_vendas || 0}
              </Text>
            </View>
            <Text className="text-3xl">🛍️</Text>
          </View>
          <View className="flex-row justify-between text-xs text-slate-600">
            <Text>
              Faturamento: {formatCurrency(reports.vendas.resumo?.faturamento_total || 0)}
            </Text>
            <Text>
              Ticket Médio: {formatCurrency(reports.vendas.resumo?.ticket_medio || 0)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Locações */}
        <TouchableOpacity
          onPress={() => setSelectedReport(selectedReport === 'locacoes' ? null : 'locacoes')}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-slate-500 text-sm mb-1">🎪 Locações</Text>
              <Text className="text-3xl font-bold text-purple-600">
                {reports.locacoes.resumo?.total_locacoes || 0}
              </Text>
            </View>
            <Text className="text-3xl">🎭</Text>
          </View>
          <View className="flex-row justify-between text-xs text-slate-600">
            <Text>Ativas: {reports.locacoes.resumo?.ativas || 0}</Text>
            <Text>Atrasadas: {reports.locacoes.resumo?.atrasadas || 0}</Text>
          </View>
        </TouchableOpacity>

        {/* Produtos */}
        <TouchableOpacity
          onPress={() => setSelectedReport(selectedReport === 'produtos' ? null : 'produtos')}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-slate-500 text-sm mb-1">📦 Produtos</Text>
              <Text className="text-3xl font-bold text-amber-600">
                {reports.produtos.resumo?.total_produtos || 0}
              </Text>
            </View>
            <Text className="text-3xl">🏷️</Text>
          </View>
          <View className="flex-row justify-between text-xs text-slate-600">
            <Text>
              Estoque: {formatCurrency(reports.produtos.resumo?.estoque_valor_total || 0)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Botão Atualizar */}
        <TouchableOpacity
          onPress={onRefresh}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-3xl mt-6 mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            🔄 Atualizar Relatórios
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
