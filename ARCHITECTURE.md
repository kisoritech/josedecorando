# 🏗️ Arquitetura do Projeto JDE Mobile

Visão técnica completa da arquitetura e fluxo de dados.

---

## 🎯 **Visão Geral da Arquitetura**

```
┌─────────────────────────────────────────────────────────────┐
│                  APLICAÇÃO MOBILE (React Native)            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CAMADA DE APRESENTAÇÃO                  │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │   │
│  │  │ Início │ │Produtos│ │Movimen.│ │ Relat. │        │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │   │
│  │       +           +          +          +            │   │
│  │       └─────────────────────────────────┘            │   │
│  │               Bottom Tab Navigator                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CAMADA DE ESTADO (Context)              │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │         AuthContext (Provider)                  │ │   │
│  │  │  • user (User | null)                           │ │   │
│  │  │  • token (string | null)                        │ │   │
│  │  │  • loading (boolean)                            │ │   │
│  │  │  • login() / logout() / register()              │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                  │
│                           │ useAuth()                        │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           CAMADA DE LÓGICA (Hooks/Services)         │   │
│  │  • loadProducts()                                   │   │
│  │  • saveProduct()                                    │   │
│  │  • loadDashboard()                                  │   │
│  │  • loadReports()                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         CAMADA DE COMUNICAÇÃO (API Client)          │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │            Axios Instance                       │ │   │
│  │  │  • baseURL: EXPO_PUBLIC_API_URL                 │ │   │
│  │  │  • timeout: 15000ms                             │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │        Interceptadores                          │ │   │
│  │  │  • Injetar Bearer Token                         │ │   │
│  │  │  • Tratar erro 401 (Logout)                     │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         CAMADA DE ARMAZENAMENTO (AsyncStorage)       │   │
│  │  • auth_token (JWT)                                 │   │
│  │  • user_data (JSON)                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ▲                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP
┌───────────────────────────┼──────────────────────────────────┐
│                           ▼                                  │
│            API BACKEND (Node.js + Express)                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Roteamento & Autenticação                │  │
│  │  • POST /api/auth/login                             │  │
│  │  • POST /api/auth/register                          │  │
│  │  • GET  /api/auth/me                                │  │
│  │  • JWT Verification Middleware                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controladores                          │  │
│  │  • AuthController                                   │  │
│  │  • ProdutoController                                │  │
│  │  • VendaController                                  │  │
│  │  • LocacaoController                                │  │
│  │  • DashboardController                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Serviços & Lógica                      │  │
│  │  • AutomacaoLancamentosService                      │  │
│  │  • LocacaoService                                   │  │
│  │  • Validações & Regras de Negócio                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Persistência                           │  │
│  │  • Database (PostgreSQL/Supabase)                   │  │
│  │  • Connection Pool                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Fluxo de Dados - Exemplo: Criar Produto**

```
1. ProductsScreen.tsx
   │
   └─→ Clica em "+" FloatingButton
       │
       └─→ 2. Modal aparece (ProductFormModal)
           │
           └─→ Usuário preenche form
               (nome, preco_venda, preco_custo, quantidade)
               │
               └─→ 3. Clica em "Salvar"
                   │
                   └─→ 4. saveProduct() executa
                       │
                       └─→ 5. setSubmitting(true) [Loading]
                           │
                           └─→ 6. api.post('/api/produtos', payload)
                               │
                               └─→ 7. Axios Interceptador
                                   │
                                   ├─→ Pega token do AsyncStorage
                                   │
                                   └─→ Injeta em header:
                                       Authorization: Bearer {token}
                                       │
                                       └─→ 8. HTTP POST para API
                                           │
                                           └─→ 9. API recebe requisição
                                               │
                                               ├─→ Verifica JWT
                                               │
                                               ├─→ Valida payload
                                               │
                                               ├─→ INSERT em banco
                                               │
                                               └─→ Retorna produto criado
                                                   │
                                                   └─→ 10. Response chega no app
                                                       │
                                                       └─→ 11. setSubmitting(false)
                                                           │
                                                           ├─→ Alert.alert('Sucesso')
                                                           │
                                                           ├─→ setModalVisible(false)
                                                           │
                                                           └─→ loadProducts() recarrega lista
```

---

## 📁 **Estrutura de Diretórios Detalhada**

```
josedecorando/
│
├── 📄 App.tsx                          ← Ponto de entrada + Navegação
├── 📄 app.json                         ← Configuração Expo
├── 📄 package.json                     ← Dependências
├── 📄 tsconfig.json                    ← Configuração TypeScript
├── 📄 .env                             ← Variáveis de ambiente
├── 📄 .gitignore
│
├── 📁 app/                             ← Expo Router (não usado)
│   └── ...
│
├── 📁 src/                             ← Código fonte
│   │
│   ├── 📁 api/
│   │   └── api.ts                     ← Axios instance + interceptadores
│   │
│   ├── 📁 components/
│   │   ├── Cards.tsx                  ← Componentes Card, StatRow
│   │   ├── Modals.tsx                 ← ConfirmModal, LoadingModal, AlertModal
│   │   └── external-link.tsx          ← Componentes do template
│   │
│   ├── 📁 context/
│   │   └── AuthContext.ts             ← Provider de autenticação + useAuth hook
│   │
│   ├── 📁 screens/
│   │   ├── LoginScreen.tsx            ← Login/Registro
│   │   ├── DashboardScreen.tsx        ← Dashboard inicial
│   │   ├── ProductsScreen.tsx         ← CRUD de produtos
│   │   ├── MovementsScreen.tsx        ← Histórico movimentações
│   │   └── ReportsScreen.tsx          ← Relatórios
│   │
│   ├── 📁 types/
│   │   └── api.ts                     ← Tipos TypeScript (30+)
│   │
│   ├── 📁 utils/
│   │   └── formatting.ts              ← formatCurrency, formatDate, etc
│   │
│   └── 📁 hooks/
│       ├── use-color-scheme.ts        ← Do template
│       └── use-color-scheme.web.ts
│
├── 📁 assets/
│   └── images/
│       └── icon.png, splash.png, etc
│
├── 📁 components/                      ← Componentes do template (não usado)
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   └── ...
│
├── 📁 constants/
│   └── theme.ts
│
├── 📁 public/                          ← Web assets (opcional)
│
├── 📁 sql/                             ← Scripts SQL da API (referência)
│   ├── schema_postgres.sql
│   └── migrations/
│
├── 📁 node_modules/                    ← Dependências (npm install)
│
├── 📚 Documentação:
│   ├── 📄 QUICKSTART.md                ← Guia de 5 minutos
│   ├── 📄 MOBILE_README.md             ← Documentação completa
│   ├── 📄 TESTING_MOBILE.md            ← Guia de testes
│   ├── 📄 SETUP_SUMMARY.md             ← Resumo de implementação
│   ├── 📄 BEST_PRACTICES.md            ← Padrões de código
│   ├── 📄 ARCHITECTURE.md              ← Este arquivo
│   └── 📄 README.md                    ← Do template
```

---

## 🔗 **Fluxo de Componentes - Árvore**

```
App
├── AuthProvider (Context)
│   └── SafeAreaProvider
│       └── NavigationContainer
│           ├── LoginScreen (sem autenticação)
│           └── TabNavigator (com autenticação)
│               ├── DashboardScreen
│               │   ├── ScrollView
│               │   ├── Header (Gradient)
│               │   ├── Card (Faturamento)
│               │   ├── StatRow
│               │   └── TouchableOpacity (Atualizar)
│               │
│               ├── ProductsScreen
│               │   ├── TextInput (Busca)
│               │   ├── FlatList
│               │   │   └── View (Card Produto)
│               │   │       ├── TouchableOpacity (Editar)
│               │   │       └── TouchableOpacity (Excluir)
│               │   ├── Modal (Novo/Editar)
│               │   └── FloatingActionButton (+)
│               │
│               ├── MovementsScreen
│               │   ├── FlatList
│               │   │   └── View (Card Movimento)
│               │   │       ├── Text (Data)
│               │   │       └── Text (Quantidade)
│               │   └── RefreshControl
│               │
│               └── ReportsScreen
│                   ├── Card (Financeiro)
│                   ├── Card (Vendas)
│                   ├── Card (Locações)
│                   ├── Card (Produtos)
│                   └── TouchableOpacity (Atualizar)
```

---

## 💾 **Fluxo de Dados no AsyncStorage**

```
┌─────────────────────────────┐
│   AsyncStorage (Local)      │
├─────────────────────────────┤
│                             │
│  auth_token: string         │
│  └─→ JWT do servidor        │
│                             │
│  user_data: JSON            │
│  └─→ {                      │
│      id: number             │
│      nome: string           │
│      email: string          │
│      perfil: string         │
│    }                        │
│                             │
└─────────────────────────────┘
         ▲          ▲
         │          │
   No login    No logout
      ↓              ↓
   setItem      removeItem
```

---

## 🔐 **Fluxo de Autenticação**

```
REGISTRO
├─ TextInput (nome, email, senha)
├─ Validação (email válido, senha 6+ caracteres)
├─ POST /api/auth/register
├─ API cria usuário + gera token
├─ Response: { token, user }
├─ Salva em AsyncStorage
├─ setUser(userData)
└─ Navegação para Dashboard

LOGIN
├─ TextInput (email, senha)
├─ Validação (email válido)
├─ POST /api/auth/login
├─ API verifica credenciais
├─ Response: { token, user }
├─ Salva em AsyncStorage
├─ setUser(userData)
└─ Navegação para Dashboard

LOGOUT
├─ removeItem('auth_token')
├─ removeItem('user_data')
├─ setToken(null)
├─ setUser(null)
└─ Navegação para LoginScreen

RELOAD (Inicialização)
├─ getItem('auth_token')
├─ if token exists:
│  ├─ GET /api/auth/me (validar)
│  ├─ if 200: setUser() → Dashboard
│  └─ if 401: limpar → LoginScreen
└─ else → LoginScreen
```

---

## 🌐 **Mapeamento de Endpoints**

| Tela | Método | Endpoint | Descrição |
|------|--------|----------|-----------|
| Login | POST | `/api/auth/login` | Autentica usuário |
| Registro | POST | `/api/auth/register` | Cria usuário |
| Auto-login | GET | `/api/auth/me` | Valida token |
| Dashboard | GET | `/api/dashboard/resumo` | Dados principais |
| | GET | `/api/dashboard/movimentacao-geral` | Movimentações |
| | GET | `/api/dashboard/vendas-relatorio` | Relatório vendas |
| Produtos | GET | `/api/produtos` | Lista |
| | POST | `/api/produtos` | Criar |
| | PUT | `/api/produtos/:id` | Editar |
| | DELETE | `/api/produtos/:id` | Excluir |
| Movimentos | GET | `/api/dashboard/movimentacao-geral` | Histórico |
| Relatórios | GET | `/api/dashboard/financeiro-completo` | Financeiro |
| | GET | `/api/dashboard/locacoes-relatorio` | Locações |
| | GET | `/api/dashboard/produtos-relatorio` | Produtos |

---

## 📊 **Estados de Componentes**

### ProductsScreen Estados
```typescript
[products]              // Lista de produtos
[loading]               // Carregando lista
[refreshing]            // Pull-to-refresh
[search]                // Filtro de busca
[modalVisible]          // Modal aberto/fechado
[editingProduct]        // Produto sendo editado (null = novo)
[form]                  // Dados do formulário
[submitting]            // Salvando formulário
```

### DashboardScreen Estados
```typescript
[dashboard]             // Dados do resumo
[loading]               // Carregando dados
[refreshing]            // Pull-to-refresh
```

### AuthContext Estados
```typescript
[user]                  // Usuário logado (null = logout)
[token]                 // JWT token
[loading]               // Carregando dados do usuário
[error]                 // Mensagem de erro
```

---

## 🎨 **Design System**

### Cores
```
Primária    → Indigo-600   (#4f46e5)
Sucesso     → Emerald-600  (#059669)
Alerta      → Amber-600    (#d97706)
Erro        → Red-600      (#dc2626)
Fundo       → Slate-50     (#f8fafc)
Borda       → Slate-200    (#e2e8f0)
Texto       → Slate-700    (#334155)
```

### Tipografia
```
Títulos     → 2xl-4xl font-bold
Subtítulos  → base-lg font-semibold
Textos      → sm-base
Labels      → xs-sm text-slate-500
```

### Spacing
```
Padding     → p-4, p-6, p-8
Margin      → m-2, m-4, m-6
Gap         → gap-3, gap-4
Rounded     → rounded-2xl, rounded-3xl
```

---

## ⚡ **Performance Considerations**

### Otimizações Implementadas
- ✅ FlatList com keyExtractor
- ✅ Pull-to-refresh para atualizações
- ✅ AsyncStorage para cache de token
- ✅ Axios timeout para evitar travamentos
- ⚠️ Sem memoização (futuro: React.memo, useMemo)

### Possíveis Melhorias
- [ ] Implementar React.memo em Cards
- [ ] Adicionar useMemo para filtros
- [ ] Cache de imagens
- [ ] Lazy loading de relatórios
- [ ] Pagination em listas grandes

---

## 🔄 **Ciclo de Vida - Exemplo Produto**

```
MOUNT
├─ useEffect(() => loadProducts())
├─ setLoading(true)
├─ GET /api/produtos
├─ setProducts(response.data)
└─ setLoading(false)

USER INTERACTION
├─ Pull-to-refresh → loadProducts()
├─ Click Edit → openModal(product)
├─ Fill Form → setForm(...)
├─ Click Save → saveProduct()
│  ├─ POST /api/produtos ou PUT /api/produtos/:id
│  ├─ setModalVisible(false)
│  └─ loadProducts() (refresh list)
└─ Click Delete → deleteProduct()
   ├─ DELETE /api/produtos/:id
   └─ loadProducts() (refresh list)

UNMOUNT
└─ Cleanup (nenhum em particular)
```

---

## 🧪 **Testabilidade**

### Testes de Componentes
```typescript
// Mockear AuthContext
// Renderizar componente
// Verificar elementos aparecem
// Simular user interactions
// Verificar callbacks
```

### Testes de Hooks
```typescript
// Renderizar hook com renderHook
// Verificar estado inicial
// Executar ação (act)
// Verificar novo estado
```

### Testes de Integração
```typescript
// Setup: AuthProvider + API mocks
// Executar fluxo completo
// Verificar mudanças visuais
// Verificar requisições HTTP
```

---

**Última atualização**: 17/05/2026
