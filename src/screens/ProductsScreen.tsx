import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '../api/api';
import { formatCurrency } from '../utils/formatting';

interface Product {
  id: number;
  nome: string;
  preco_venda: number | string;
  preco_custo: number | string;
  quantidade: number;
  tipo: string;
  ativo: boolean;
}

interface ProductFormData {
  nome: string;
  preco_venda: string;
  preco_custo: string;
  quantidade: string;
  tipo: string;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>({
    nome: '',
    preco_venda: '',
    preco_custo: '',
    quantidade: '0',
    tipo: 'ambos',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/produtos');
      setProducts(response.data);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        nome: product.nome,
        preco_venda: product.preco_venda.toString(),
        preco_custo: product.preco_custo.toString(),
        quantidade: product.quantidade.toString(),
        tipo: product.tipo,
      });
    } else {
      setEditingProduct(null);
      setForm({
        nome: '',
        preco_venda: '',
        preco_custo: '',
        quantidade: '0',
        tipo: 'ambos',
      });
    }
    setModalVisible(true);
  };

  const saveProduct = async () => {
    if (!form.nome.trim()) {
      Alert.alert('Erro', 'Nome do produto é obrigatório');
      return;
    }

    if (!form.preco_venda || parseFloat(form.preco_venda) <= 0) {
      Alert.alert('Erro', 'Preço de venda é obrigatório');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nome: form.nome.trim(),
        preco_venda: parseFloat(form.preco_venda),
        preco_custo: parseFloat(form.preco_custo) || 0,
        quantidade: parseInt(form.quantidade) || 0,
        tipo: form.tipo,
      };

      if (editingProduct) {
        await api.put(`/api/produtos/${editingProduct.id}`, payload);
        Alert.alert('Sucesso', 'Produto atualizado');
      } else {
        await api.post('/api/produtos', payload);
        Alert.alert('Sucesso', 'Produto cadastrado');
      }

      setModalVisible(false);
      loadProducts();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao salvar');
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
            loadProducts();
          } catch (err) {
            Alert.alert('Erro', 'Falha ao excluir produto');
          }
        },
      },
    ]);
  };

  const filteredProducts = products.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

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
        <Text className="text-white text-3xl font-bold">Produtos</Text>
        <Text className="text-white/80 text-sm">Gestão de Estoque</Text>
      </View>

      {/* Search */}
      <View className="px-6 py-4">
        <TextInput
          placeholder="🔍 Buscar produto..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#cbd5e1"
          className="bg-white border border-slate-200 rounded-3xl px-5 py-4"
        />
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadProducts();
          }} tintColor="#4f46e5" />
        }
        renderItem={({ item }) => (
          <View className="mx-4 mb-3 bg-white rounded-3xl p-5 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="font-bold text-lg flex-1 mr-2">{item.nome}</Text>
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-700 font-semibold text-sm">
                  {item.quantidade} un
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text className="text-slate-600">
                Venda: <Text className="font-semibold">{formatCurrency(item.preco_venda)}</Text>
              </Text>
              <Text className="text-slate-600">
                Custo: <Text className="font-semibold">{formatCurrency(item.preco_custo)}</Text>
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => openModal(item)}
                className="flex-1 bg-indigo-100 py-3 rounded-2xl"
              >
                <Text className="text-indigo-700 text-center font-semibold">✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteProduct(item.id)}
                className="flex-1 bg-red-100 py-3 rounded-2xl"
              >
                <Text className="text-red-700 text-center font-semibold">🗑️ Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-slate-500 text-lg">📦 Nenhum produto encontrado</Text>
          </View>
        }
      />

      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => openModal(null)}
        className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full items-center justify-center shadow-2xl"
      >
        <Text className="text-white text-4xl font-light">+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-4xl p-6 pt-8">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-2xl font-bold mb-6">
                {editingProduct ? '✏️ Editar Produto' : '➕ Novo Produto'}
              </Text>

              <TextInput
                placeholder="Nome do Produto"
                value={form.nome}
                onChangeText={(text) => setForm({ ...form, nome: text })}
                placeholderTextColor="#cbd5e1"
                className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-4"
                editable={!submitting}
              />

              <TextInput
                placeholder="Preço de Venda"
                value={form.preco_venda}
                onChangeText={(text) => setForm({ ...form, preco_venda: text })}
                keyboardType="decimal-pad"
                placeholderTextColor="#cbd5e1"
                className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-4"
                editable={!submitting}
              />

              <TextInput
                placeholder="Preço de Custo"
                value={form.preco_custo}
                onChangeText={(text) => setForm({ ...form, preco_custo: text })}
                keyboardType="decimal-pad"
                placeholderTextColor="#cbd5e1"
                className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-4"
                editable={!submitting}
              />

              <TextInput
                placeholder="Quantidade Inicial"
                value={form.quantidade}
                onChangeText={(text) => setForm({ ...form, quantidade: text })}
                keyboardType="number-pad"
                placeholderTextColor="#cbd5e1"
                className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-6"
                editable={!submitting}
              />

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  disabled={submitting}
                  className="flex-1 py-4 border border-slate-300 rounded-2xl"
                >
                  <Text className="text-center font-semibold text-slate-700">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveProduct}
                  disabled={submitting}
                  className="flex-1 py-4 bg-indigo-600 rounded-2xl"
                >
                  {submitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center font-semibold">Salvar</Text>
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
