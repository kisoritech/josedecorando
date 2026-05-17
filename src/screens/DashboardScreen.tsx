import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatting';

interface DashboardData {
  total_clientes: string;
  total_produtos: string;
  produtos_disponiveis: string;
  faturamento_total: string;
  total_pix: string;
  total_dinheiro: string;
  locacoes_ativas: string;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard/resumo');
      setDashboard(response.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      Alert.alert('Erro', 'Não foi possível carregar o dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
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
      <View className="bg-gradient-to-b from-indigo-600 to-purple-600 pt-12 pb-8 px-6">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="w-14 h-14 bg-white/20 rounded-3xl items-center justify-center">
            <Text className="text-4xl">🎈</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold">JDE</Text>
            <Text className="text-white/80 text-sm">Gestão Completa</Text>
          </View>
        </View>
        <Text className="text-white text-lg">
          Olá, <Text className="font-semibold">{user?.nome || 'Usuário'}</Text> 👋
        </Text>
      </View>

      {/* Cards Principais */}
      <View className="px-6 py-6 space-y-4">
        {/* Faturamento Total */}
        <View className="bg-white rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-slate-500 text-sm mb-1">Faturamento Total</Text>
              <Text className="text-4xl font-bold text-emerald-600">
                {formatCurrency(dashboard?.faturamento_total || 0)}
              </Text>
            </View>
            <Text className="text-5xl">💰</Text>
          </View>
        </View>

        {/* Grid 2 colunas */}
        <View className="flex-row gap-4">
          {/* Produtos */}
          <View className="flex-1 bg-white rounded-3xl p-5 shadow-sm">
            <Text className="text-slate-500 text-xs mb-2">Produtos</Text>
            <Text className="text-3xl font-bold text-indigo-600 mb-1">
              {dashboard?.total_produtos}
            </Text>
            <Text className="text-xs text-slate-400">
              {dashboard?.produtos_disponiveis} disponíveis
            </Text>
          </View>

          {/* Clientes */}
          <View className="flex-1 bg-white rounded-3xl p-5 shadow-sm">
            <Text className="text-slate-500 text-xs mb-2">Clientes</Text>
            <Text className="text-3xl font-bold text-blue-600 mb-1">
              {dashboard?.total_clientes}
            </Text>
            <Text className="text-xs text-slate-400">Cadastrados</Text>
          </View>
        </View>

        {/* Locações Ativas */}
        <View className="bg-white rounded-3xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-slate-500 text-sm mb-1">Locações Ativas</Text>
              <Text className="text-4xl font-bold text-amber-600">
                {dashboard?.locacoes_ativas}
              </Text>
            </View>
            <Text className="text-5xl">📦</Text>
          </View>
        </View>

        {/* Pagamentos */}
        <View className="bg-white rounded-3xl p-6 shadow-sm">
          <Text className="text-slate-800 font-semibold mb-4">Pagamentos</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">📱</Text>
                <Text className="text-slate-700">PIX Recebido</Text>
              </View>
              <Text className="font-semibold text-emerald-600">
                {formatCurrency(dashboard?.total_pix || 0)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">💵</Text>
                <Text className="text-slate-700">Dinheiro</Text>
              </View>
              <Text className="font-semibold text-amber-600">
                {formatCurrency(dashboard?.total_dinheiro || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Botão Atualizar */}
        <TouchableOpacity
          onPress={onRefresh}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-3xl mt-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            🔄 Atualizar Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
