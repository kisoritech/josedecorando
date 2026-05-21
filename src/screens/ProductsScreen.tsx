import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BRAND } from '../../constants/theme';
import api from '../api/api';
import { Product, useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatting';

interface ProductFormData {
  nome: string;
  preco_venda: string;
  preco_custo: string;
  quantidade: string;
  tipo: string;
}

const emptyForm: ProductFormData = {
  nome: '',
  preco_venda: '',
  preco_custo: '',
  quantidade: '0',
  tipo: 'ambos',
};

export default function ProductsScreen() {
  const { products, productsLoading, productsError, loadProducts, isRefreshing, refreshAllData } = useData();
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(search.trim().toLowerCase())
  );

  const onRefresh = useCallback(() => {
    refreshAllData();
  }, [refreshAllData]);

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setForm(
      product
        ? {
            nome: product.nome,
            preco_venda: String(product.preco_venda),
            preco_custo: String(product.preco_custo),
            quantidade: String(product.quantidade),
            tipo: product.tipo,
          }
        : emptyForm
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const saveProduct = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'Nome do produto é obrigatório');
      return;
    }

    if (!form.preco_venda || Number(form.preco_venda.replace(',', '.')) <= 0) {
      Alert.alert('Erro', 'Preço de venda é obrigatório');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nome: form.nome.trim(),
        preco_venda: Number(form.preco_venda.replace(',', '.')),
        preco_custo: Number(form.preco_custo.replace(',', '.')) || 0,
        quantidade: Number.parseInt(form.quantidade, 10) || 0,
        tipo: form.tipo,
      };

      if (editingProduct) {
        await api.put(`/api/produtos/${editingProduct.id}`, payload);
        Alert.alert('Sucesso', 'Produto atualizado');
      } else {
        await api.post('/api/produtos', payload);
        Alert.alert('Sucesso', 'Produto cadastrado');
      }

      closeModal();
      await loadProducts();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao salvar produto');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = (id: number) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/produtos/${id}`);
            Alert.alert('Sucesso', 'Produto excluído');
            await loadProducts();
          } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.message || 'Falha ao excluir produto');
          }
        },
      },
    ]);
  };

  if (productsLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[BRAND.primary, BRAND.secondary]} style={styles.header}>
        <Text style={styles.headerTitle}>Produtos</Text>
        <Text style={styles.headerSubtitle}>Gestão de estoque</Text>
      </LinearGradient>

      <View style={styles.searchWrapper}>
        <MaterialIcons name="search" size={22} color="#94A3B8" />
        <TextInput
          placeholder="Buscar produto"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      {productsError && products.length === 0 ? (
        <View style={styles.centeredContent}>
          <Text style={styles.errorText}>{productsError}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={loadProducts}>
            <Text style={styles.primaryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.nome}
                </Text>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>{item.quantidade} un</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.mutedText}>Venda: {formatCurrency(item.preco_venda)}</Text>
                <Text style={styles.mutedText}>Custo: {formatCurrency(item.preco_custo)}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                  <MaterialIcons name="edit" size={18} color={BRAND.primary} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(item.id)}>
                  <MaterialIcons name="delete-outline" size={18} color="#B91C1C" />
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="inventory-2" size={40} color="#94A3B8" />
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={() => openModal(null)}>
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingProduct ? 'Editar produto' : 'Novo produto'}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.iconButton}>
                  <MaterialIcons name="close" size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              <FormInput
                placeholder="Nome do produto"
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
                editable={!submitting}
              />
              <FormInput
                placeholder="Preço de venda"
                value={form.preco_venda}
                onChangeText={(text) => setForm({ ...form, preco_venda: text })}
                keyboardType="decimal-pad"
                editable={!submitting}
              />
              <FormInput
                placeholder="Preço de custo"
                value={form.preco_custo}
                onChangeText={(text) => setForm({ ...form, preco_custo: text })}
                keyboardType="decimal-pad"
                editable={!submitting}
              />
              <FormInput
                placeholder="Quantidade inicial"
                value={form.quantidade}
                onChangeText={(text) => setForm({ ...form, quantidade: text })}
                keyboardType="number-pad"
                editable={!submitting}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal} disabled={submitting}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveProduct} disabled={submitting}>
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FormInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} placeholderTextColor="#94A3B8" style={styles.input} />;
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: '#111827',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 104,
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
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  productName: {
    flex: 1,
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  stockBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stockText: {
    color: '#166534',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  mutedText: {
    flex: 1,
    color: '#475569',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  editButtonText: {
    color: BRAND.primary,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: BRAND.primary,
    elevation: 6,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  modalContent: {
    maxHeight: '88%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#111827',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingBottom: 8,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: BRAND.primary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
