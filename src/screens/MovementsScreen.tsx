import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BRAND } from '../../constants/theme';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatting';

export default function MovementsScreen() {
  const { movements, movementsLoading, movementsError, isRefreshing, refreshAllData } = useData();

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (movementsLoading && movements.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  if (movementsError && movements.length === 0) {
    return (
      <View style={styles.centeredContent}>
        <Text style={styles.errorText}>{movementsError}</Text>
        <Text style={styles.mutedText}>Tente novamente mais tarde</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[BRAND.primary, BRAND.secondary]} style={styles.header}>
        <Text style={styles.headerTitle}>Movimentações</Text>
        <Text style={styles.headerSubtitle}>Entrada e saída de estoque</Text>
      </LinearGradient>

      <FlatList
        data={movements}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isEntry = item.tipo === 'entrada';

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleBlock}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.produto_nome || item.observacao || 'Sem descrição'}
                  </Text>
                  <Text style={styles.dateText}>{formatDate(item.data)}</Text>
                </View>
                <View style={[styles.quantityBadge, isEntry ? styles.entryBadge : styles.exitBadge]}>
                  <MaterialIcons
                    name={isEntry ? 'arrow-downward' : 'arrow-upward'}
                    size={18}
                    color={isEntry ? '#047857' : '#B91C1C'}
                  />
                  <Text style={[styles.quantityText, isEntry ? styles.entryText : styles.exitText]}>
                    {item.quantidade}
                  </Text>
                </View>
              </View>

              {item.valor_unitario ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valor unitário</Text>
                  <Text style={styles.detailValue}>{formatCurrency(item.valor_unitario)}</Text>
                </View>
              ) : null}

              {item.origem ? <Text style={styles.originText}>Origem: {item.origem}</Text> : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="sync-alt" size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>Nenhuma movimentação registrada</Text>
          </View>
        }
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  itemTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  dateText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  quantityBadge: {
    minWidth: 72,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 12,
  },
  entryBadge: {
    backgroundColor: '#D1FAE5',
  },
  exitBadge: {
    backgroundColor: '#FEE2E2',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '800',
  },
  entryText: {
    color: '#047857',
  },
  exitText: {
    color: '#B91C1C',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
  },
  detailLabel: {
    color: '#64748B',
  },
  detailValue: {
    color: '#111827',
    fontWeight: '700',
  },
  originText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 10,
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
    marginBottom: 12,
  },
  mutedText: {
    color: '#64748B',
    textAlign: 'center',
  },
});
