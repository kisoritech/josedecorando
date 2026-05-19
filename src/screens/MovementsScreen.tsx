import React, { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View
} from 'react-native';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatting';

export default function MovementsScreen() {
  const { movements, movementsLoading, movementsError, loadMovements, isRefreshing, refreshAllData } = useData();

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (movementsLoading && movements.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (movementsError && movements.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-red-500 text-center text-base mb-4">{movementsError}</Text>
        <Text className="text-slate-400 text-center text-base">Tente novamente mais tarde</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-gradient-to-b from-indigo-600 to-purple-600 pt-12 pb-6 px-6">
        <Text className="text-white text-3xl font-bold">Movimentações</Text>
        <Text className="text-white/80 text-sm">Entrada e Saída de Estoque</Text>
      </View>

      {/* Movements List */}
      <FlatList
        data={movements}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-3xl p-5 mb-3 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="font-bold text-lg mb-1">
                  {item.produto_nome || item.observacao || 'Sem descrição'}
                </Text>
                <Text className="text-slate-500 text-sm">
                  {formatDate(item.data)}
                </Text>
              </View>
              <View
                className={`px-4 py-2 rounded-full ${
                  item.tipo === 'entrada' ? 'bg-emerald-100' : 'bg-red-100'
                }`}
              >
                <Text
                  className={`font-bold text-lg ${
                    item.tipo === 'entrada' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {item.tipo === 'entrada' ? '+' : '-'}
                  {item.quantidade}
                </Text>
              </View>
            </View>

            {item.valor_unitario && (
              <View className="flex-row justify-between items-center text-sm">
                <Text className="text-slate-500">Valor Unitário</Text>
                <Text className="font-semibold text-slate-700">
                  {formatCurrency(item.valor_unitario)}
                </Text>
              </View>
            )}
            {item.origem && (
              <Text className="text-slate-400 text-xs mt-2">Origem: {item.origem}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-slate-400 text-center text-base">
              Nenhuma movimentação registrada
            </Text>
          </View>
        }
      />
    </View>
  );
}
