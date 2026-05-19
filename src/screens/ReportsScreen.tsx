import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatting';

export default function ReportsScreen() {
  const { reports, reportsLoading, reportsError, isRefreshing, refreshAllData } = useData();
  const [selectedReport, setSelectedReport] = useState<'financeiro' | 'vendas' | 'locacoes' | 'produtos' | null>(null);

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (reportsLoading && !reports.financeiro.resumo) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (reportsError && !reports.financeiro.resumo) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-red-500 text-center text-base mb-4">{reportsError}</Text>
        <TouchableOpacity
          onPress={onRefresh}
          className="bg-indigo-600 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
      }
    >
      {/* Header */}
      <View className="bg-gradient-to-b from-indigo-600 to-purple-600 pt-12 pb-6 px-6">
        <Text className="text-white text-3xl font-bold">Relatórios</Text>
        <Text className="text-white/80 text-sm">Análise e resumo do negócio</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row gap-2 px-6 pt-6 pb-4 overflow-x-auto">
        {[
          { key: 'financeiro', label: '💰 Financeiro' },
          { key: 'vendas', label: '📈 Vendas' },
          { key: 'locacoes', label: '📦 Locações' },
          { key: 'produtos', label: '🛍️ Produtos' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedReport(tab.key as any)}
            className={`px-4 py-2 rounded-full ${
              selectedReport === tab.key ? 'bg-indigo-600' : 'bg-white'
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                selectedReport === tab.key ? 'text-white' : 'text-slate-700'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Content */}
      <View className="px-6 pb-8">
        {/* Financeiro */}
        {selectedReport === 'financeiro' && reports.financeiro.resumo && (
          <View className="space-y-4">
            <Text className="text-2xl font-bold mb-4 text-slate-900">Resumo Financeiro</Text>
            <ReportCard
              title="Total de Lançamentos"
              value={reports.financeiro.resumo.total_lancamentos}
              icon="📋"
            />
            <ReportCard
              title="Total Débitos"
              value={formatCurrency(reports.financeiro.resumo.total_debitos)}
              icon="📉"
            />
            <ReportCard
              title="Total Créditos"
              value={formatCurrency(reports.financeiro.resumo.total_creditos)}
              icon="📈"
            />
            <ReportCard
              title="Total Pago"
              value={formatCurrency(reports.financeiro.resumo.total_pago)}
              icon="✅"
            />
            <ReportCard
              title="Total Pendente"
              value={formatCurrency(reports.financeiro.resumo.total_pendente)}
              icon="⏳"
            />
          </View>
        )}

        {/* Vendas */}
        {selectedReport === 'vendas' && reports.vendas.resumo && (
          <View className="space-y-4">
            <Text className="text-2xl font-bold mb-4 text-slate-900">Resumo de Vendas</Text>
            <ReportCard
              title="Total de Vendas"
              value={reports.vendas.resumo.total_vendas}
              icon="🛒"
            />
            <ReportCard
              title="Faturamento Total"
              value={formatCurrency(reports.vendas.resumo.faturamento_total)}
              icon="💰"
            />
            <ReportCard
              title="Ticket Médio"
              value={formatCurrency(reports.vendas.resumo.ticket_medio)}
              icon="📊"
            />
          </View>
        )}

        {/* Locações */}
        {selectedReport === 'locacoes' && reports.locacoes.resumo && (
          <View className="space-y-4">
            <Text className="text-2xl font-bold mb-4 text-slate-900">Resumo de Locações</Text>
            <ReportCard
              title="Total de Locações"
              value={reports.locacoes.resumo.total_locacoes}
              icon="📦"
            />
            <ReportCard
              title="Locações Ativas"
              value={reports.locacoes.resumo.ativas}
              icon="✅"
            />
            <ReportCard
              title="Locações Atrasadas"
              value={reports.locacoes.resumo.atrasadas}
              icon="⚠️"
            />
            <ReportCard
              title="Devolvidas"
              value={reports.locacoes.resumo.devolvidas}
              icon="↩️"
            />
          </View>
        )}

        {/* Produtos */}
        {selectedReport === 'produtos' && reports.produtos.resumo && (
          <View className="space-y-4">
            <Text className="text-2xl font-bold mb-4 text-slate-900">Resumo de Produtos</Text>
            <ReportCard
              title="Total de Produtos"
              value={reports.produtos.resumo.total_produtos}
              icon="🛍️"
            />
            <ReportCard
              title="Valor Total em Estoque"
              value={formatCurrency(reports.produtos.resumo.estoque_valor_total)}
              icon="💵"
            />
          </View>
        )}

        {/* Default: Show first available report */}
        {!selectedReport && reports.financeiro.resumo && (
          <View className="space-y-4">
            <Text className="text-2xl font-bold mb-4 text-slate-900">Resumo Financeiro</Text>
            <ReportCard
              title="Total de Lançamentos"
              value={reports.financeiro.resumo.total_lancamentos}
              icon="📋"
            />
            <ReportCard
              title="Total Débitos"
              value={formatCurrency(reports.financeiro.resumo.total_debitos)}
              icon="📉"
            />
            <ReportCard
              title="Total Créditos"
              value={formatCurrency(reports.financeiro.resumo.total_creditos)}
              icon="📈"
            />
            <ReportCard
              title="Total Pago"
              value={formatCurrency(reports.financeiro.resumo.total_pago)}
              icon="✅"
            />
            <ReportCard
              title="Total Pendente"
              value={formatCurrency(reports.financeiro.resumo.total_pendente)}
              icon="⏳"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ReportCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <View className="bg-white rounded-3xl p-6 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-slate-600 text-sm mb-2">{title}</Text>
          <Text className="text-2xl font-bold text-slate-900">{value}</Text>
        </View>
        <Text className="text-4xl">{icon}</Text>
      </View>
    </View>
  );
}
