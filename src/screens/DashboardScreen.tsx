import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND } from '../../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatting';

type RouteKey = 'inicio' | 'venda' | 'locacao' | 'clientes' | 'produtos' | 'movimentos' | 'relatorios';

export default function DashboardScreen({ onNavigate }: { onNavigate?: (route: RouteKey) => void }) {
  const { user } = useAuth();
  const { dashboard, dashboardLoading, dashboardError, loadDashboard, isRefreshing, refreshAllData } = useData();

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (dashboardLoading && !dashboard) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  if (dashboardError && !dashboard) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.errorTitle}>Erro ao carregar</Text>
        <Text style={styles.errorText}>{dashboardError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />}
    >
      <LinearGradient colors={[BRAND.primary, BRAND.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.kicker}>Jose Decorando Encantando</Text>
        <Text style={styles.title}>Olá, {user?.nome || 'usuário'}</Text>
        <Text style={styles.subtitle}>Um resumo rápido do app para você ir direto para venda, locação ou cadastros.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.metricsGrid}>
          <MetricCard title="Faturamento" value={formatCurrency(dashboard?.faturamento_total || 0)} icon="payments" color={BRAND.success} />
          <MetricCard title="Produtos" value={dashboard?.total_produtos || '0'} icon="inventory-2" color={BRAND.secondary} />
          <MetricCard title="Clientes" value={dashboard?.total_clientes || '0'} icon="groups" color={BRAND.accent} />
          <MetricCard title="Locações" value={dashboard?.locacoes_ativas || '0'} icon="event-available" color={BRAND.gold} />
        </View>

        <Text style={styles.sectionTitle}>Acessos principais</Text>
        <View style={styles.quickFlex}>
          <QuickAction title="Nova venda" icon="point-of-sale" onPress={() => onNavigate?.('venda')} />
          <QuickAction title="Nova locação" icon="event-available" onPress={() => onNavigate?.('locacao')} />
          <QuickAction title="Relatórios" icon="bar-chart" onPress={() => onNavigate?.('relatorios')} />
          <QuickAction title="Produtos" icon="inventory-2" onPress={() => onNavigate?.('produtos')} />
        </View>

        <Text style={styles.sectionTitle}>Mais opções</Text>
        <View style={styles.connectedBox}>
          <QuickAction title="Clientes" icon="groups" onPress={() => onNavigate?.('clientes')} compact />
          <QuickAction title="Movimentos" icon="sync-alt" onPress={() => onNavigate?.('movimentos')} compact />
          <QuickAction title="Cadastrar produto" icon="add-box" onPress={() => onNavigate?.('produtos')} compact />
          <QuickAction title="Cadastrar cliente" icon="person-add" onPress={() => onNavigate?.('clientes')} compact />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={onRefresh}>
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>Atualizar resumo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function QuickAction({
  title,
  icon,
  onPress,
  compact = false,
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.quickAction, compact && styles.quickActionCompact]} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={BRAND.primary} />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 44,
    paddingBottom: 30,
    paddingHorizontal: 22,
  },
  kicker: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    minHeight: 126,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  metricIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  metricTitle: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  metricValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 12,
  },
  quickFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  connectedBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  quickAction: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  quickActionCompact: {
    backgroundColor: '#F8FAFC',
  },
  quickActionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  updateButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: BRAND.primary,
    marginTop: 18,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  errorTitle: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  errorText: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 18,
  },
  retryButton: {
    borderRadius: 8,
    backgroundColor: BRAND.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
