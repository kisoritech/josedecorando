import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    View
} from 'react-native';
import api from '../api/api';
import { formatCurrency, formatDate } from '../utils/formatting';

interface Movement {
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

export default function MovementsScreen() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMovements = async () => {
    try {
      const response = await api.get('/api/dashboard/movimentacao-geral');
      setMovements(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar movimentações:', err);
      Alert.alert('Erro', 'Não foi possível carregar as movimentações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMovements();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#4f46e5" />
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
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

            <View className="flex-row justify-between items-center pt-3 border-t border-slate-100">
              <View>
                <Text className="text-slate-500 text-xs mb-1">Tipo</Text>
                <Text className="text-slate-700 font-semibold text-sm">
                  {item.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                </Text>
              </View>
              <View>
                <Text className="text-slate-500 text-xs mb-1">Origem</Text>
                <Text className="text-slate-700 font-semibold text-sm capitalize">
                  {item.origem || 'ajuste'}
                </Text>
              </View>
              {item.valor_unitario && (
                <View>
                  <Text className="text-slate-500 text-xs mb-1">Unit.</Text>
                  <Text className="text-slate-700 font-semibold text-sm">
                    {formatCurrency(item.valor_unitario)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-slate-500 text-lg">📦 Nenhuma movimentação encontrada</Text>
          </View>
        }
      />
    </View>
  );
}
