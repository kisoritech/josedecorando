import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BRAND } from '../../constants/theme';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatting';

type ReportKey = 'financeiro' | 'vendas' | 'locacoes' | 'produtos';

const tabs: { key: ReportKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'financeiro', label: 'Financeiro', icon: 'account-balance-wallet' },
  { key: 'vendas', label: 'Vendas', icon: 'trending-up' },
  { key: 'locacoes', label: 'Locações', icon: 'event-available' },
  { key: 'produtos', label: 'Produtos', icon: 'inventory-2' },
];

export default function ReportsScreen() {
  const { reports, reportsLoading, reportsError, isRefreshing, refreshAllData } = useData();
  const [selectedReport, setSelectedReport] = useState<ReportKey>('financeiro');

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (reportsLoading && !reports.financeiro.resumo) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  if (reportsError && !reports.financeiro.resumo) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.errorText}>{reportsError}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />
      }
    >
      <LinearGradient colors={[BRAND.primary, BRAND.secondary]} style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Análise e resumo do negócio</Text>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {tabs.map((tab) => {
          const selected = selectedReport === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedReport(tab.key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <MaterialIcons name={tab.icon} size={18} color={selected ? '#FFFFFF' : '#334155'} />
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        {selectedReport === 'financeiro' && reports.financeiro.resumo ? (
          <ReportSection title="Resumo financeiro">
            <ReportCard title="Total de lançamentos" value={reports.financeiro.resumo.total_lancamentos} icon="receipt-long" />
            <ReportCard title="Total débitos" value={formatCurrency(reports.financeiro.resumo.total_debitos)} icon="south-west" />
            <ReportCard title="Total créditos" value={formatCurrency(reports.financeiro.resumo.total_creditos)} icon="north-east" />
            <ReportCard title="Total pago" value={formatCurrency(reports.financeiro.resumo.total_pago)} icon="check-circle" />
            <ReportCard title="Total pendente" value={formatCurrency(reports.financeiro.resumo.total_pendente)} icon="schedule" />
          </ReportSection>
        ) : null}

        {selectedReport === 'vendas' && reports.vendas.resumo ? (
          <ReportSection title="Resumo de vendas">
            <ReportCard title="Total de vendas" value={reports.vendas.resumo.total_vendas} icon="shopping-cart" />
            <ReportCard title="Faturamento total" value={formatCurrency(reports.vendas.resumo.faturamento_total)} icon="payments" />
            <ReportCard title="Ticket médio" value={formatCurrency(reports.vendas.resumo.ticket_medio)} icon="bar-chart" />
          </ReportSection>
        ) : null}

        {selectedReport === 'locacoes' && reports.locacoes.resumo ? (
          <ReportSection title="Resumo de locações">
            <ReportCard title="Total de locações" value={reports.locacoes.resumo.total_locacoes} icon="event-note" />
            <ReportCard title="Locações ativas" value={reports.locacoes.resumo.ativas} icon="check-circle" />
            <ReportCard title="Locações atrasadas" value={reports.locacoes.resumo.atrasadas} icon="warning" />
            <ReportCard title="Devolvidas" value={reports.locacoes.resumo.devolvidas} icon="assignment-return" />
          </ReportSection>
        ) : null}

        {selectedReport === 'produtos' && reports.produtos.resumo ? (
          <ReportSection title="Resumo de produtos">
            <ReportCard title="Total de produtos" value={reports.produtos.resumo.total_produtos} icon="inventory-2" />
            <ReportCard title="Valor total em estoque" value={formatCurrency(reports.produtos.resumo.estoque_valor_total)} icon="payments" />
          </ReportSection>
        ) : null}

        {!getSelectedReportHasData(selectedReport, reports) ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="bar-chart" size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>Nenhum dado encontrado para este relatório</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function getSelectedReportHasData(selectedReport: ReportKey, reports: ReturnType<typeof useData>['reports']) {
  return Boolean(reports[selectedReport]?.resumo);
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ReportCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      <View style={styles.cardIcon}>
        <MaterialIcons name={icon} size={24} color={BRAND.primary} />
      </View>
    </View>
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
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    marginTop: 4,
  },
  tabs: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tab: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabSelected: {
    backgroundColor: BRAND.primary,
    borderColor: BRAND.primary,
  },
  tabText: {
    color: '#334155',
    fontWeight: '700',
  },
  tabTextSelected: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  card: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardText: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 6,
  },
  cardValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  cardIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    gap: 12,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 18,
  },
  primaryButton: {
    borderRadius: 8,
    backgroundColor: BRAND.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
