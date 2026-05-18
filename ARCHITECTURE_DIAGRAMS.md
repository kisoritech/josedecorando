# 🎨 Diagramas de Arquitetura - JDE Venda

## 1️⃣ Fluxo de Comunicação

```
┌─────────────────────────────────────────────────────────┐
│                     JDE VENDA APP                       │
│  (React Native + Expo + TypeScript)                    │
└─────────────┬───────────────────────────────────────────┘
              │
              ├──────────────────────────────────────────┐
              │                                          │
         ┌────▼──────┐     ┌──────────────┐             │
         │ LoginScreen│     │ DashboardScreen           │
         └────┬──────┘     └──────────┬──────┘          │
              │                       │                  │
              │     ┌─────────────────┼─────────────────┤
              │     │                 │                  │
              │     │                 │                  │
         ┌────▼─────▼─────────────────▼──────┐           │
         │    AuthContext & Screens Module    │           │
         │  - login() / register()            │           │
         │  - logout()                        │           │
         │  - loadUser()                      │           │
         └────────────┬──────────────────────┘           │
                      │                                   │
         ┌────────────▼────────────────┐                  │
         │    api.ts (Axios Instance)   │                 │
         │  - baseURL: EXPO_PUBLIC_API  │                 │
         │  - timeout: 15000ms          │                 │
         │  - interceptors              │                 │
         │  - logging                   │                 │
         └────────────┬────────────────┘                  │
                      │                                   │
                      │ HTTPS                            │
                      │ Bearer Token                      │
                      │ JSON                             │
                      │                                   │
         ┌────────────▼──────────────────────────────┐   │
         │ https://api-jose-jhbt.onrender.com (API)  │   │
         │                                           │   │
         │  ├─ /api/auth/login                       │   │
         │  ├─ /api/auth/register                    │   │
         │  ├─ /api/auth/me                          │   │
         │  ├─ /api/dashboard/resumo                 │   │
         │  ├─ /api/dashboard/movimentacao-geral     │   │
         │  ├─ /api/dashboard/financeiro-completo    │   │
         │  ├─ /api/dashboard/vendas-relatorio       │   │
         │  ├─ /api/dashboard/locacoes-relatorio     │   │
         │  ├─ /api/dashboard/produtos-relatorio     │   │
         │  └─ /api/produtos (CRUD)                  │   │
         │                                           │   │
         │  Database (Supabase/PostgreSQL)            │   │
         └───────────────────────────────────────────┘   │
                                                          │
         ┌────────────────────────────────────────────┐  │
         │         AsyncStorage (Token Cache)         │  │
         │  - auth_token                              │  │
         │  - user_data                               │  │
         └────────────────────────────────────────────┘  │
                                                          │
              └──────────────────────────────────────────┘
```

---

## 2️⃣ Fluxo de Autenticação

```
┌──────────────────────────────────────────────┐
│        Usuário Abre App                      │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│   AuthContext.loadUser()                     │
│   - Procura por token em AsyncStorage        │
└────────┬───────────────────────────┬─────────┘
         │                           │
    Token? Não                    Token? Sim
         │                           │
         ▼                           ▼
    ┌─────────┐           ┌──────────────────┐
    │ Login   │           │ Validar Token    │
    │ Screen  │           │ GET /api/auth/me │
    └────┬────┘           └────┬─────────┬───┘
         │                     │         │
    [Email/Pwd]          Válido?        Inválido?
         │                     │         │
         ▼                     ▼         ▼
    POST /api/auth/login   Carregar  Logout &
    - email                Usuario   Login
    - password             Info     Screen
         │
         ▼
    ┌──────────────┐
    │ Receber      │
    │ - Token      │
    │ - User Data  │
    └────┬─────────┘
         │
         ▼
    ┌──────────────────────────┐
    │ Salvar em AsyncStorage    │
    │ - auth_token              │
    │ - user_data               │
    └────┬─────────────────────┘
         │
         ▼
    ┌──────────────────────────┐
    │ Dashboard Screen          │
    │ Dados Carregados          │
    │ Autenticado ✅            │
    └──────────────────────────┘
```

---

## 3️⃣ Ciclo de Vida de Uma Requisição

```
1. Usuário Clica [Login]
   ↓
2. LoginScreen.handleSubmit()
   ↓
3. AuthContext.login(email, password)
   ↓
4. api.interceptors.request
   ├─ Recupera token do AsyncStorage
   └─ Adiciona header: Authorization: Bearer {token}
   ↓
5. api.post('/api/auth/login', {email, password})
   ├─ URL Base: https://api-jose-jhbt.onrender.com
   ├─ Timeout: 15000ms
   └─ Headers: Content-Type: application/json
   ↓
6. Requisição HTTPS enviada
   ↓
7. API Backend Processa
   ├─ Valida credenciais
   ├─ Gera token JWT
   └─ Retorna: {token, user}
   ↓
8. api.interceptors.response
   ├─ Valida status (200)
   ├─ Log: [API Response] 200
   └─ Retorna dados
   ↓
9. AuthContext recebe resposta
   ├─ Valida dados
   ├─ Salva em AsyncStorage
   ├─ Atualiza estado
   └─ Log: [Auth] Login realizado
   ↓
10. UI Atualiza
    └─ Navega para DashboardScreen
    ↓
11. DashboardScreen carrega dados
    ├─ api.get('/api/dashboard/resumo')
    ├─ Interceptor adiciona token
    └─ Dados carregam
```

---

## 4️⃣ Tratamento de Erros

```
Erro na Requisição?
    │
    ├─ Network Error
    │  └─ "Erro de conexão com a API"
    │
    ├─ 401 Unauthorized
    │  ├─ Token expirado?
    │  ├─ Limpa AsyncStorage
    │  ├─ Força logout
    │  └─ "Email ou senha incorretos"
    │
    ├─ 404 Not Found
    │  └─ "Usuário não encontrado"
    │
    ├─ 409 Conflict
    │  └─ "Email já cadastrado"
    │
    ├─ 422 Unprocessable Entity
    │  └─ "Dados inválidos"
    │
    ├─ ECONNABORTED (Timeout)
    │  └─ "Requisição expirou"
    │
    └─ Log em console
       [API Error] {status, message, url}
```

---

## 5️⃣ Estrutura de Dados

### Usuário (Após Login)
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "perfil": "vendedor",
  "ativo": true
}
```

### Token
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Dashboard Resumo
```json
{
  "total_clientes": "45",
  "total_produtos": "128",
  "produtos_disponiveis": "95",
  "faturamento_total": "15000.00",
  "total_pix": "8000.00",
  "total_dinheiro": "7000.00",
  "locacoes_ativas": "12"
}
```

### Produto
```json
{
  "id": 1,
  "nome": "Decoração de Festa",
  "preco_venda": 150.00,
  "preco_custo": 80.00,
  "quantidade": 50,
  "tipo": "ambos",
  "ativo": true
}
```

---

## 6️⃣ Estado da Aplicação

```
App State Tree
├── Auth Context
│   ├── user: User | null
│   ├── token: string | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── methods:
│       ├── login()
│       ├── register()
│       ├── logout()
│       └── clearError()
│
├── Screen Data
│   ├── Dashboard
│   │   ├── dashboard: DashboardData | null
│   │   ├── loading: boolean
│   │   └── refreshing: boolean
│   │
│   ├── Products
│   │   ├── products: Product[]
│   │   ├── loading: boolean
│   │   ├── modalVisible: boolean
│   │   └── editingProduct: Product | null
│   │
│   ├── Movements
│   │   ├── movements: Movement[]
│   │   └── loading: boolean
│   │
│   └── Reports
│       ├── reports: ReportData
│       └── loading: boolean
│
└── AsyncStorage
    ├── auth_token: string
    └── user_data: string (JSON)
```

---

## 7️⃣ Fluxo de Renderização

```
App.tsx
├── AuthProvider
│   └── Checking Auth
│       ├─ Loading?
│       │  └─ Show Spinner
│       │
│       ├─ Authenticated?
│       │  └─ TabNavigator
│       │     ├─ DashboardScreen
│       │     ├─ ProductsScreen
│       │     ├─ MovementsScreen
│       │     └─ ReportsScreen
│       │
│       └─ Not Auth?
│          └─ LoginScreen
│             ├─ Login Form
│             └─ Register Tab
```

---

## 8️⃣ Ciclo de Debug

```
Problema Identificado?
    │
    ├─ Abrir Console (F12 ou adb logcat)
    │
    ├─ Procurar por [API Error]
    │  ├─ Status?
    │  ├─ Message?
    │  └─ URL?
    │
    ├─ Ativar Debug Mode
    │  ├─ EXPO_PUBLIC_DEBUG=true
    │  └─ Reiniciar app
    │
    ├─ Procurar logs:
    │  ├─ [API Request]
    │  ├─ [API Response]
    │  ├─ [API Error]
    │  └─ [Auth]
    │
    ├─ Executar scripts:
    │  ├─ node scripts/health-check.js
    │  └─ node scripts/test-api.ts
    │
    └─ Consultar TROUBLESHOOTING.md
```

---

## 📊 Resumo Visual

```
┌────────────────┐
│  Usuário/UI    │  (React Native)
└────────┬───────┘
         │
     ┌───▼────────────────────────────┐
     │  AuthContext + Screens          │  (Business Logic)
     │  - Login/Register               │
     │  - Data Loading                 │
     └───┬────────────────────────────┘
         │
     ┌───▼────────────────────────────┐
     │  API Client (axios)              │  (HTTP Layer)
     │  - Logging                       │
     │  - Error Handling                │
     │  - Token Management              │
     └───┬────────────────────────────┘
         │
     ┌───▼────────────────────────────┐
     │ https://api-jose-jhbt.onrender.com│ (Backend API)
     │  - Authentication               │
     │  - Data CRUD                    │
     │  - Business Logic               │
     └────────────────────────────────┘
         │
     ┌───▼────────────────────────────┐
     │  Database (PostgreSQL/Supabase) │  (Data Layer)
     │  - Users                        │
     │  - Products                     │
     │  - Transactions                 │
     └────────────────────────────────┘
```

---

**Última atualização:** 18 de maio de 2026
**Status:** ✅ Estrutura Validada
