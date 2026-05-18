import { LinearGradient } from 'expo-linear-gradient';
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
import { BRAND } from '../../constants/theme';
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
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />
      }
    >
      {/* Header com Gradiente e Logo */}
      <LinearGradient
        colors={[BRAND.primary, BRAND.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 48, paddingBottom: 32, paddingHorizontal: 24 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <View
            style={{
              width: 56,
              height: 56,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32 }}>🎉</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>JDE</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
              Jose Decorando Encantando
            </Text>
          </View>
        </View>
        <Text style={{ color: 'white', fontSize: 18 }}>
          Olá, <Text style={{ fontWeight: 'bold' }}>{user?.nome || 'Usuário'}</Text> 👋
        </Text>
      </LinearGradient>

      {/* Cards Principais */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 24, gap: 16 }}>
        {/* Faturamento Total */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>
                Faturamento Total
              </Text>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: BRAND.success }}>
                {formatCurrency(dashboard?.faturamento_total || 0)}
              </Text>
            </View>
            <Text style={{ fontSize: 40 }}>💰</Text>
          </View>
        </View>

        {/* Grid 2 colunas */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* Produtos */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 8 }}>Produtos</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: BRAND.secondary, marginBottom: 4 }}>
              {dashboard?.total_produtos}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              {dashboard?.produtos_disponiveis} disponíveis
            </Text>
          </View>

          {/* Clientes */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 8 }}>Clientes</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: BRAND.accent, marginBottom: 4 }}>
              {dashboard?.total_clientes}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Cadastrados</Text>
          </View>
        </View>

        {/* Locações Ativas */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>
                Locações Ativas
              </Text>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: BRAND.gold }}>
                {dashboard?.locacoes_ativas}
              </Text>
            </View>
            <Text style={{ fontSize: 40 }}>📦</Text>
          </View>
        </View>

        {/* Pagamentos */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <Text style={{ color: '#1F2937', fontWeight: 'bold', marginBottom: 16, fontSize: 16 }}>
            Pagamentos
          </Text>
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>📱</Text>
                <Text style={{ color: '#1F2937' }}>PIX Recebido</Text>
              </View>
              <Text style={{ fontWeight: '600', color: BRAND.success }}>
                {formatCurrency(dashboard?.total_pix || 0)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>💵</Text>
                <Text style={{ color: '#1F2937' }}>Dinheiro</Text>
              </View>
              <Text style={{ fontWeight: '600', color: BRAND.gold }}>
                {formatCurrency(dashboard?.total_dinheiro || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Botão Atualizar */}
        <LinearGradient
          colors={[BRAND.primary, BRAND.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, marginTop: 16, marginBottom: 16 }}
        >
          <TouchableOpacity onPress={onRefresh} style={{ paddingVertical: 16 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
              🔄 Atualizar Dashboard
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
