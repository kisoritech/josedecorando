# 📐 Guia de Boas Práticas - Projeto JDE Mobile

Padrões e convenções a seguir neste projeto.

---

## 📝 **Convenções de Código**

### Nomes de Arquivos
```typescript
// ✅ Correto
LoginScreen.tsx
ProductsScreen.tsx
AuthContext.ts
api.ts
formatting.ts

// ❌ Errado
loginscreen.tsx
products_screen.tsx
AuthenticationContext.ts
apiClient.ts
format.ts
```

### Nomes de Componentes
```typescript
// ✅ Correto - PascalCase
export function DashboardScreen() {}
export function Card() {}
export function ConfirmModal() {}

// ❌ Errado
export function dashboardScreen() {}
export function card() {}
export function confirm_modal() {}
```

### Nomes de Funções/Variáveis
```typescript
// ✅ Correto - camelCase
const loadProducts = () => {}
const formatCurrency = (value) => {}
const isValidEmail = (email) => {}

// ❌ Errado
const LoadProducts = () => {}
const format_currency = (value) => {}
const is_valid_email = (email) => {}
```

### Constantes
```typescript
// ✅ Correto - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_TIMEOUT = 15000;
const DEFAULT_PAGE_SIZE = 20;

// ❌ Errado
const maxRetries = 3;
const apiTimeout = 15000;
const DefaultPageSize = 20;
```

---

## 🎨 **Padrões de Componentes**

### Componente Funcional com Hooks
```typescript
// ✅ Correto
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const [state, setState] = useState(false);

  useEffect(() => {
    // Efeito colateral
  }, []);

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

### Interface/Types
```typescript
// ✅ Correto - Interface no início do arquivo
interface ProductScreenProps {
  navigation?: any;
}

interface ProductFormData {
  nome: string;
  preco_venda: number;
}

// Com documentação JSDoc
/**
 * Formato esperado para uma venda
 * @interface VendaForm
 * @property {number} cliente_id - ID do cliente
 * @property {string[]} forma_pagamento - Método de pagamento
 */
interface VendaForm {
  cliente_id: number;
  forma_pagamento: string;
}
```

---

## 🔌 **Padrões de API**

### Usar useAsync Hook Pattern
```typescript
// ✅ Correto
const loadProducts = async () => {
  setLoading(true);
  try {
    const response = await api.get('/api/produtos');
    setProducts(response.data);
  } catch (error) {
    Alert.alert('Erro', 'Falha ao carregar');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadProducts();
}, []);
```

### Tratamento de Erros
```typescript
// ✅ Correto
try {
  const response = await api.post('/api/vendas', payload);
  Alert.alert('Sucesso', 'Venda criada');
} catch (error: any) {
  // Mensagem do servidor
  const message = error.response?.data?.message || 'Erro desconhecido';
  Alert.alert('Erro', message);
}

// ❌ Errado
try {
  const response = await api.post('/api/vendas', payload);
} catch (error) {
  Alert.alert('Erro', 'Algo deu errado'); // Genérico demais
}
```

---

## 🎯 **Padrões de Estado**

### Estado com TypeScript
```typescript
// ✅ Correto
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ❌ Errado
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### Evitar Estado Redundante
```typescript
// ✅ Correto
const [items, setItems] = useState<Item[]>([]);
const itemCount = items.length; // Derivado

// ❌ Errado
const [items, setItems] = useState<Item[]>([]);
const [itemCount, setItemCount] = useState(0); // Redundante
```

---

## 🎨 **Padrões de Estilo (Tailwind)**

### Usar NativeWind Classes
```typescript
// ✅ Correto
<View className="flex-1 bg-slate-50 p-6">
  <Text className="text-2xl font-bold text-slate-900 mb-4">Título</Text>
  <TouchableOpacity className="bg-indigo-600 py-3 rounded-2xl">
    <Text className="text-white text-center font-semibold">Botão</Text>
  </TouchableOpacity>
</View>

// ❌ Errado
<View style={{ flex: 1, backgroundColor: '#f8fafc', padding: 24 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Título</Text>
  <TouchableOpacity style={{ backgroundColor: '#4f46e5', paddingVertical: 12 }}>
    <Text style={{ color: 'white', textAlign: 'center' }}>Botão</Text>
  </TouchableOpacity>
</View>
```

### Cores Padrão
```typescript
// Primária (Indigo)
className="bg-indigo-600 text-indigo-600 border-indigo-600"

// Sucesso (Emerald)
className="bg-emerald-600 text-emerald-600 border-emerald-600"

// Alerta (Amber)
className="bg-amber-600 text-amber-600 border-amber-600"

// Erro (Red)
className="bg-red-600 text-red-600 border-red-600"

// Neutro (Slate)
className="bg-slate-100 text-slate-700 border-slate-200"
```

---

## 🔐 **Padrões de Autenticação**

### Usar Hook useAuth
```typescript
// ✅ Correto
import { useAuth } from '../context/AuthContext';

export function MyScreen() {
  const { user, login, logout } = useAuth();

  return (
    <Text>Olá, {user?.nome}</Text>
  );
}

// ❌ Errado
import { AuthContext } from '../context/AuthContext';

export function MyScreen() {
  const context = React.useContext(AuthContext);
  const user = context?.user;
}
```

### Persistência de Dados
```typescript
// ✅ Correto - Salvar dados sensíveis com cuidado
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('auth_token', token);
const token = await AsyncStorage.getItem('auth_token');

// ❌ Errado
localStorage.setItem('auth_token', token); // Não existe em React Native
```

---

## 📱 **Padrões de UX/UI**

### Loading States
```typescript
// ✅ Correto
{loading ? (
  <ActivityIndicator size="large" color="#4f46e5" />
) : (
  <FlatList data={items} ... />
)}

// ❌ Errado
{loading && <Text>Carregando...</Text>}
<FlatList data={items} ... />
```

### Feedback de Ação
```typescript
// ✅ Correto
const saveProduct = async () => {
  setSubmitting(true);
  try {
    await api.post('/api/produtos', payload);
    Alert.alert('Sucesso', 'Produto salvo');
    navigation.goBack();
  } catch (error: any) {
    Alert.alert('Erro', error.response?.data?.message);
  } finally {
    setSubmitting(false);
  }
};
```

### Confirmação de Ações Destrutivas
```typescript
// ✅ Correto
const deleteProduct = (id: number) => {
  Alert.alert('Confirmar', 'Deseja realmente excluir?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: () => performDelete(id) }
  ]);
};
```

---

## 🧪 **Padrões de Testes**

### Teste de Componente
```typescript
// ✅ Correto
describe('ProductCard', () => {
  it('should render product name', () => {
    const { getByText } = render(
      <ProductCard name="Caixa de Som" />
    );
    expect(getByText('Caixa de Som')).toBeTruthy();
  });
});
```

### Teste de Hook
```typescript
// ✅ Correto
describe('useAuth', () => {
  it('should login user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@email.com', '123456');
    });

    expect(result.current.user).toBeTruthy();
  });
});
```

---

## 📚 **Documentação**

### Comentários JSDoc
```typescript
// ✅ Correto
/**
 * Formata um valor numérico como moeda brasileira
 * @param {number | string} value - Valor a formatar
 * @returns {string} Valor formatado em BRL
 * @example
 * formatCurrency(199.90) // "R$ 199,90"
 */
export const formatCurrency = (value: number | string): string => {
  // ...
};

// ❌ Errado
// formata moeda
const formatCurrency = (value) => {};
```

### Comentários Inline
```typescript
// ✅ Correto
// Valida email antes de salvar
if (!isValidEmail(email)) {
  return;
}

// ❌ Errado
// TODO: validar email depois
// FIXME: email pode estar inválido
// HACK: por enquanto aceita qualquer email
```

---

## 🚀 **Padrões de Performance**

### Memoização
```typescript
// ✅ Correto - Evita re-render desnecessário
const ProductCard = React.memo(({ product, onPress }: Props) => {
  return <View>...</View>;
});

// ✅ Correto - useMemo para cálculos custosos
const filteredProducts = useMemo(() => {
  return products.filter(p => p.nome.includes(search));
}, [products, search]);
```

### Key em Listas
```typescript
// ✅ Correto
<FlatList
  data={products}
  keyExtractor={item => item.id.toString()}
  renderItem={({ item }) => <ProductCard {...item} />}
/>

// ❌ Errado
<FlatList
  data={products}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => <ProductCard {...item} />}
/>
```

---

## 🔄 **Git & Commits**

### Mensagens de Commit
```bash
# ✅ Correto - Seguir padrão Conventional Commits
git commit -m "feat: adicionar tela de produtos"
git commit -m "fix: corrigir erro de autenticação"
git commit -m "docs: atualizar README"
git commit -m "refactor: simplificar lógica de API"
git commit -m "test: adicionar testes de autenticação"

# ❌ Errado
git commit -m "mudanças"
git commit -m "ajustes"
git commit -m "fix bug"
```

### Branch Naming
```bash
# ✅ Correto
git checkout -b feature/adicionar-tela-clientes
git checkout -b fix/erro-login
git checkout -b docs/guia-uso

# ❌ Errado
git checkout -b novo-feature
git checkout -b fix1
git checkout -b temp
```

---

## ✅ **Checklist de Qualidade**

Antes de fazer commit:

- [ ] Código compila sem erros
- [ ] TypeScript strict mode passa
- [ ] Sem console.log() de debug
- [ ] Comentado em JSDoc
- [ ] Testes passam
- [ ] Segue padrões de código
- [ ] Mensagem de commit clara
- [ ] Sem dados sensíveis (tokens, etc)

---

## 📖 **Referências**

- [React Native Best Practices](https://reactnative.dev/docs/guidelines)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Expo Guidelines](https://docs.expo.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Última atualização**: 17/05/2026
