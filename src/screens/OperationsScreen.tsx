import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export type OperationMode = 'venda' | 'locacao' | 'clientes' | 'produtos';

interface Client {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
}

const operationTabs: { key: OperationMode; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'venda', label: 'Venda', icon: 'point-of-sale' },
  { key: 'locacao', label: 'Locação', icon: 'event-available' },
  { key: 'clientes', label: 'Clientes', icon: 'groups' },
  { key: 'produtos', label: 'Produto', icon: 'inventory-2' },
];

const today = new Date().toISOString().slice(0, 10);

export default function OperationsScreen({
  initialMode = 'venda',
  onNavigate,
}: {
  initialMode?: OperationMode;
  onNavigate?: (route: any) => void;
}) {
  const { products, loadProducts, refreshAllData, isRefreshing } = useData();
  const [mode, setMode] = useState<OperationMode>(initialMode);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const [sale, setSale] = useState({
    cliente_id: '',
    produto_id: '',
    quantidade: '1',
    valor_unitario: '',
    forma_pagamento: 'PIX',
    frete_valor: '0',
  });
  const [rental, setRental] = useState({
    cliente_id: '',
    produto_id: '',
    quantidade: '1',
    valor_unitario: '',
    data_inicio: today,
    data_prevista_devolucao: today,
    observacao: '',
  });
  const [clientForm, setClientForm] = useState({
    nome: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    tipo_pessoa: 'fisica',
  });
  const [productForm, setProductForm] = useState({
    nome: '',
    preco_venda: '',
    preco_custo: '',
    quantidade: '0',
    tipo: 'ambos',
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const loadClients = useCallback(async () => {
    try {
      setLoadingClients(true);
      const response = await api.get('/api/clientes');
      setClients(response.data || []);
    } catch {
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
    loadProducts();
  }, [loadClients, loadProducts]);

  const selectedProduct = products.find((product) => product.id === Number(getCurrentProductId(mode, sale, rental)));
  const selectedClient = clients.find((client) => client.id === Number(getCurrentClientId(mode, sale, rental)));
  const filteredClients = filterBySearch(clients, clientSearch, (client) => `${client.id} ${client.nome} ${client.email || ''} ${client.telefone || ''}`);
  const filteredProducts = filterBySearch(products, productSearch, (product) => `${product.id} ${product.nome}`);
  const salePreview = getOperationPreview(sale.quantidade, sale.valor_unitario, selectedProduct, sale.frete_valor);
  const rentalPreview = getOperationPreview(rental.quantidade, rental.valor_unitario, selectedProduct);

  const onRefresh = useCallback(async () => {
    await Promise.all([refreshAllData(), loadClients()]);
  }, [loadClients, refreshAllData]);

  const saveSale = async () => {
    if (!sale.cliente_id || !sale.produto_id) {
      Alert.alert('Erro', 'Informe cliente e produto para a venda');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/vendas', {
        cliente_id: Number(sale.cliente_id),
        forma_pagamento: sale.forma_pagamento,
        frete_valor: sale.frete_valor || '0',
        itens: [
          {
            produto_id: Number(sale.produto_id),
            quantidade: Number(sale.quantidade) || 1,
            valor_unitario: Number(sale.valor_unitario.replace(',', '.')) || selectedProduct?.preco_venda || 0,
          },
        ],
      });
      Alert.alert('Sucesso', 'Venda registrada');
      setSale({ cliente_id: '', produto_id: '', quantidade: '1', valor_unitario: '', forma_pagamento: 'PIX', frete_valor: '0' });
      await refreshAllData();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao registrar venda');
    } finally {
      setSubmitting(false);
    }
  };

  const saveRental = async () => {
    if (!rental.cliente_id || !rental.produto_id) {
      Alert.alert('Erro', 'Informe cliente e produto para a locação');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/locacoes', {
        cliente_id: Number(rental.cliente_id),
        produto_id: Number(rental.produto_id),
        quantidade: Number(rental.quantidade) || 1,
        valor_unitario: Number(rental.valor_unitario.replace(',', '.')) || selectedProduct?.preco_venda || 0,
        data_inicio: rental.data_inicio,
        data_prevista_devolucao: rental.data_prevista_devolucao,
        observacao: rental.observacao,
      });
      Alert.alert('Sucesso', 'Locação registrada');
      setRental({ cliente_id: '', produto_id: '', quantidade: '1', valor_unitario: '', data_inicio: today, data_prevista_devolucao: today, observacao: '' });
      await refreshAllData();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao registrar locação');
    } finally {
      setSubmitting(false);
    }
  };

  const saveClient = async () => {
    if (!clientForm.nome.trim()) {
      Alert.alert('Erro', 'Nome do cliente é obrigatório');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/clientes', {
        tipo_pessoa: clientForm.tipo_pessoa,
        nome: clientForm.nome.trim(),
        cpf_cnpj: clientForm.cpf_cnpj.trim(),
        email: clientForm.email.trim(),
        telefone: clientForm.telefone.trim(),
      });
      Alert.alert('Sucesso', 'Cliente cadastrado');
      setClientForm({ nome: '', cpf_cnpj: '', email: '', telefone: '', tipo_pessoa: 'fisica' });
      await loadClients();
      await refreshAllData();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao cadastrar cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const saveProduct = async () => {
    if (!productForm.nome.trim() || !productForm.preco_venda) {
      Alert.alert('Erro', 'Informe nome e preço de venda');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/produtos', {
        nome: productForm.nome.trim(),
        preco_venda: Number(productForm.preco_venda.replace(',', '.')),
        preco_custo: Number(productForm.preco_custo.replace(',', '.')) || 0,
        quantidade: Number.parseInt(productForm.quantidade, 10) || 0,
        tipo: productForm.tipo,
      });
      Alert.alert('Sucesso', 'Produto cadastrado');
      setProductForm({ nome: '', preco_venda: '', preco_custo: '', quantidade: '0', tipo: 'ambos' });
      await refreshAllData();
      onNavigate?.('produtos');
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao cadastrar produto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={BRAND.primary} />}
    >
      <LinearGradient colors={[BRAND.primary, BRAND.secondary]} style={styles.header}>
        <Text style={styles.headerTitle}>Central de operações</Text>
        <Text style={styles.headerSubtitle}>Venda, locação, clientes e produtos em um fluxo lateral</Text>
      </LinearGradient>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {operationTabs.map((tab) => {
          const selected = mode === tab.key;
          return (
            <TouchableOpacity key={tab.key} onPress={() => setMode(tab.key)} style={[styles.tab, selected && styles.tabSelected]}>
              <MaterialIcons name={tab.icon} size={18} color={selected ? '#FFFFFF' : '#334155'} />
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        {(mode === 'venda' || mode === 'locacao') && (
          <View style={styles.summaryRow}>
            <InfoPill icon="groups" label="Cliente" value={selectedClient?.nome || 'Selecione pelo ID'} />
            <InfoPill icon="inventory-2" label="Produto" value={selectedProduct?.nome || 'Selecione pelo ID'} />
          </View>
        )}

        {mode === 'venda' && (
          <Panel title="Nova venda">
            <SearchPicker
              title="Cliente"
              placeholder="Buscar cliente por nome, telefone ou e-mail"
              search={clientSearch}
              selectedId={sale.cliente_id}
              loading={loadingClients}
              items={filteredClients.map((client) => ({
                id: client.id,
                title: client.nome,
                subtitle: [client.email, client.telefone].filter(Boolean).join(' | ') || `ID ${client.id}`,
              }))}
              onSearch={setClientSearch}
              onSelect={(client) => {
                setSale({ ...sale, cliente_id: String(client.id) });
                setClientSearch(client.title);
              }}
            />
            <SearchPicker
              title="Produto"
              placeholder="Buscar produto pelo nome"
              search={productSearch}
              selectedId={sale.produto_id}
              items={filteredProducts.map((product) => ({
                id: product.id,
                title: product.nome,
                subtitle: `ID ${product.id} | estoque: ${product.quantidade}`,
                value: product,
              }))}
              onSearch={setProductSearch}
              onSelect={(product) => {
                const value = product.value as Product | undefined;
                setSale({
                  ...sale,
                  produto_id: String(product.id),
                  valor_unitario: sale.valor_unitario || String(value?.preco_venda || ''),
                });
                setProductSearch(product.title);
              }}
            />
            <FormInput placeholder="Quantidade" value={sale.quantidade} onChangeText={(text) => setSale({ ...sale, quantidade: text })} keyboardType="number-pad" />
            <FormInput placeholder="Valor unitário" value={sale.valor_unitario} onChangeText={(text) => setSale({ ...sale, valor_unitario: text })} keyboardType="decimal-pad" />
            <FormInput placeholder="Forma de pagamento: PIX, Dinheiro ou Cartão" value={sale.forma_pagamento} onChangeText={(text) => setSale({ ...sale, forma_pagamento: text })} />
            <FormInput placeholder="Frete" value={sale.frete_valor} onChangeText={(text) => setSale({ ...sale, frete_valor: text })} keyboardType="decimal-pad" />
            <ValuePreview
              title="Prévia da venda"
              rows={[
                { label: 'Valor unitário', value: formatPreviewCurrency(salePreview.unitPrice) },
                { label: 'Quantidade', value: String(salePreview.quantity) },
                { label: 'Subtotal', value: formatPreviewCurrency(salePreview.subtotal) },
                { label: 'Frete', value: formatPreviewCurrency(salePreview.freight) },
              ]}
              total={formatPreviewCurrency(salePreview.total)}
            />
            <SubmitButton label="Registrar venda" icon="check-circle" submitting={submitting} onPress={saveSale} />
          </Panel>
        )}

        {mode === 'locacao' && (
          <Panel title="Nova locação">
            <SearchPicker
              title="Cliente"
              placeholder="Buscar cliente por nome, telefone ou e-mail"
              search={clientSearch}
              selectedId={rental.cliente_id}
              loading={loadingClients}
              items={filteredClients.map((client) => ({
                id: client.id,
                title: client.nome,
                subtitle: [client.email, client.telefone].filter(Boolean).join(' | ') || `ID ${client.id}`,
              }))}
              onSearch={setClientSearch}
              onSelect={(client) => {
                setRental({ ...rental, cliente_id: String(client.id) });
                setClientSearch(client.title);
              }}
            />
            <SearchPicker
              title="Produto"
              placeholder="Buscar produto pelo nome"
              search={productSearch}
              selectedId={rental.produto_id}
              items={filteredProducts.map((product) => ({
                id: product.id,
                title: product.nome,
                subtitle: `ID ${product.id} | estoque: ${product.quantidade}`,
                value: product,
              }))}
              onSearch={setProductSearch}
              onSelect={(product) => {
                const value = product.value as Product | undefined;
                setRental({
                  ...rental,
                  produto_id: String(product.id),
                  valor_unitario: rental.valor_unitario || String(value?.preco_venda || ''),
                });
                setProductSearch(product.title);
              }}
            />
            <FormInput placeholder="Quantidade" value={rental.quantidade} onChangeText={(text) => setRental({ ...rental, quantidade: text })} keyboardType="number-pad" />
            <FormInput placeholder="Valor unitário" value={rental.valor_unitario} onChangeText={(text) => setRental({ ...rental, valor_unitario: text })} keyboardType="decimal-pad" />
            <FormInput placeholder="Data início (AAAA-MM-DD)" value={rental.data_inicio} onChangeText={(text) => setRental({ ...rental, data_inicio: text })} />
            <FormInput placeholder="Devolução prevista (AAAA-MM-DD)" value={rental.data_prevista_devolucao} onChangeText={(text) => setRental({ ...rental, data_prevista_devolucao: text })} />
            <FormInput placeholder="Observação" value={rental.observacao} onChangeText={(text) => setRental({ ...rental, observacao: text })} />
            <ValuePreview
              title="Prévia da locação"
              rows={[
                { label: 'Valor unitário', value: formatPreviewCurrency(rentalPreview.unitPrice) },
                { label: 'Quantidade', value: String(rentalPreview.quantity) },
                { label: 'Subtotal', value: formatPreviewCurrency(rentalPreview.subtotal) },
              ]}
              total={formatPreviewCurrency(rentalPreview.total)}
            />
            <SubmitButton label="Registrar locação" icon="event-available" submitting={submitting} onPress={saveRental} />
          </Panel>
        )}

        {mode === 'clientes' && (
          <Panel title="Adicionar cliente">
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                onPress={() => setClientForm({ ...clientForm, tipo_pessoa: 'fisica', cpf_cnpj: '' })}
                style={[styles.segmentButton, clientForm.tipo_pessoa === 'fisica' && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentText, clientForm.tipo_pessoa === 'fisica' && styles.segmentTextActive]}>
                  CPF
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setClientForm({ ...clientForm, tipo_pessoa: 'juridica', cpf_cnpj: '' })}
                style={[styles.segmentButton, clientForm.tipo_pessoa === 'juridica' && styles.segmentButtonActive]}
              >
                <Text style={[styles.segmentText, clientForm.tipo_pessoa === 'juridica' && styles.segmentTextActive]}>
                  CNPJ
                </Text>
              </TouchableOpacity>
            </View>
            <FormInput placeholder="Nome do cliente" value={clientForm.nome} onChangeText={(text) => setClientForm({ ...clientForm, nome: text })} />
            <FormInput
              placeholder={clientForm.tipo_pessoa === 'fisica' ? 'CPF do cliente' : 'CNPJ do cliente'}
              value={clientForm.cpf_cnpj}
              onChangeText={(text) => setClientForm({ ...clientForm, cpf_cnpj: text })}
              keyboardType="number-pad"
            />
            <FormInput placeholder="E-mail" value={clientForm.email} onChangeText={(text) => setClientForm({ ...clientForm, email: text })} keyboardType="email-address" />
            <FormInput placeholder="Telefone" value={clientForm.telefone} onChangeText={(text) => setClientForm({ ...clientForm, telefone: text })} keyboardType="phone-pad" />
            <SubmitButton label="Cadastrar cliente" icon="person-add" submitting={submitting} onPress={saveClient} />
          </Panel>
        )}

        {mode === 'produtos' && (
          <Panel title="Adicionar produto">
            <FormInput placeholder="Nome do produto" value={productForm.nome} onChangeText={(text) => setProductForm({ ...productForm, nome: text })} />
            <FormInput placeholder="Preço de venda" value={productForm.preco_venda} onChangeText={(text) => setProductForm({ ...productForm, preco_venda: text })} keyboardType="decimal-pad" />
            <FormInput placeholder="Preço de custo" value={productForm.preco_custo} onChangeText={(text) => setProductForm({ ...productForm, preco_custo: text })} keyboardType="decimal-pad" />
            <FormInput placeholder="Quantidade inicial" value={productForm.quantidade} onChangeText={(text) => setProductForm({ ...productForm, quantidade: text })} keyboardType="number-pad" />
            <FormInput placeholder="Tipo: venda, aluguel ou ambos" value={productForm.tipo} onChangeText={(text) => setProductForm({ ...productForm, tipo: text })} />
            <SubmitButton label="Cadastrar produto" icon="add-box" submitting={submitting} onPress={saveProduct} />
          </Panel>
        )}
      </View>
    </ScrollView>
  );
}

function getCurrentProductId(mode: OperationMode, sale: { produto_id: string }, rental: { produto_id: string }) {
  return mode === 'venda' ? sale.produto_id : rental.produto_id;
}

function getCurrentClientId(mode: OperationMode, sale: { cliente_id: string }, rental: { cliente_id: string }) {
  return mode === 'venda' ? sale.cliente_id : rental.cliente_id;
}

function filterBySearch<T>(items: T[], search: string, getText: (item: T) => string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return items.slice(0, 8);
  }

  return items.filter((item) => getText(item).toLowerCase().includes(normalizedSearch)).slice(0, 8);
}

function parseMoney(value?: string | number) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  return Number(String(value || '').replace(',', '.')) || 0;
}

function getOperationPreview(quantity: string, unitPrice: string, selectedProduct?: Product, freight = '0') {
  const parsedQuantity = Number.parseInt(quantity, 10) || 0;
  const parsedUnitPrice = parseMoney(unitPrice) || parseMoney(selectedProduct?.preco_venda);
  const parsedFreight = parseMoney(freight);
  const subtotal = parsedQuantity * parsedUnitPrice;

  return {
    quantity: parsedQuantity,
    unitPrice: parsedUnitPrice,
    freight: parsedFreight,
    subtotal,
    total: subtotal + parsedFreight,
  };
}

function formatPreviewCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function SearchPicker({
  title,
  placeholder,
  search,
  selectedId,
  items,
  loading,
  onSearch,
  onSelect,
}: {
  title: string;
  placeholder: string;
  search: string;
  selectedId: string;
  items: { id: number; title: string; subtitle?: string; value?: unknown }[];
  loading?: boolean;
  onSearch: (text: string) => void;
  onSelect: (item: { id: number; title: string; subtitle?: string; value?: unknown }) => void;
}) {
  return (
    <View style={styles.pickerBox}>
      <Text style={styles.pickerTitle}>{title}</Text>
      <View style={styles.searchWrapper}>
        <MaterialIcons name="search" size={20} color="#94A3B8" />
        <TextInput
          placeholder={placeholder}
          value={search}
          onChangeText={onSearch}
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={BRAND.primary} style={styles.pickerLoading} />
      ) : (
        <View style={styles.optionList}>
          {items.length === 0 ? (
            <Text style={styles.emptyOption}>Nenhum registro encontrado</Text>
          ) : (
            items.map((item) => {
              const selected = selectedId === String(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelect(item)}
                  style={[styles.optionRow, selected && styles.optionRowSelected]}
                >
                  <View style={styles.optionTextBlock}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.subtitle ? (
                      <Text style={[styles.optionSubtitle, selected && styles.optionSubtitleSelected]} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  {selected ? <MaterialIcons name="check-circle" size={20} color={BRAND.primary} /> : null}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}

function ValuePreview({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { label: string; value: string }[];
  total: string;
}) {
  return (
    <View style={styles.previewBox}>
      <View style={styles.previewHeader}>
        <MaterialIcons name="request-quote" size={20} color={BRAND.primary} />
        <Text style={styles.previewTitle}>{title}</Text>
      </View>
      {rows.map((row) => (
        <View key={row.label} style={styles.previewRow}>
          <Text style={styles.previewLabel}>{row.label}</Text>
          <Text style={styles.previewValue}>{row.value}</Text>
        </View>
      ))}
      <View style={styles.previewTotalRow}>
        <Text style={styles.previewTotalLabel}>Total</Text>
        <Text style={styles.previewTotalValue}>{total}</Text>
      </View>
    </View>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}

function FormInput(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} placeholderTextColor="#94A3B8" style={styles.input} />;
}

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoPill}>
      <MaterialIcons name={icon} size={20} color={BRAND.primary} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SubmitButton({
  label,
  icon,
  submitting,
  onPress,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  submitting: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={onPress} disabled={submitting}>
      {submitting ? <ActivityIndicator color="#FFFFFF" /> : <MaterialIcons name={icon} size={20} color="#FFFFFF" />}
      {!submitting ? <Text style={styles.submitButtonText}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 42,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.84)',
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
  summaryRow: {
    gap: 10,
    marginBottom: 14,
  },
  infoPill: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  panel: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  panelTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  pickerBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginBottom: 12,
  },
  pickerTitle: {
    color: '#334155',
    fontWeight: '800',
    marginBottom: 8,
  },
  searchWrapper: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    paddingVertical: 12,
  },
  pickerLoading: {
    marginTop: 12,
  },
  optionList: {
    gap: 8,
    marginTop: 10,
  },
  optionRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  optionRowSelected: {
    borderColor: BRAND.primary,
    backgroundColor: '#EEF2FF',
  },
  optionTextBlock: {
    flex: 1,
  },
  optionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  optionTitleSelected: {
    color: BRAND.primary,
  },
  optionSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3,
  },
  optionSubtitleSelected: {
    color: '#475569',
  },
  emptyOption: {
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 12,
  },
  previewBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
    padding: 14,
    marginBottom: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  previewTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '900',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 5,
  },
  previewLabel: {
    color: '#475569',
    fontWeight: '700',
  },
  previewValue: {
    color: '#111827',
    fontWeight: '800',
  },
  previewTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#C7D2FE',
    marginTop: 8,
    paddingTop: 12,
  },
  previewTotalLabel: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  previewTotalValue: {
    color: BRAND.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  input: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#111827',
    fontSize: 16,
  },
  segmentedControl: {
    minHeight: 46,
    flexDirection: 'row',
    gap: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  segmentButtonActive: {
    borderColor: BRAND.primary,
    backgroundColor: '#EEF2FF',
  },
  segmentText: {
    color: '#475569',
    fontWeight: '800',
  },
  segmentTextActive: {
    color: BRAND.primary,
  },
  submitButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: BRAND.primary,
    marginTop: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
