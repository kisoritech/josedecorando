# 🎈 JDE - José Decorando Encantando
## Aplicativo Mobile React Native + Expo

Aplicação mobile de gestão de clientes, produtos, vendas, locações, estoque, transações e relatórios financeiros.

---

## 📋 Requisitos

- **Node.js** 18+ e **npm**
- **Expo CLI**: `npm install -g expo-cli`
- **Device ou Emulador** (Android/iOS)
- **API Backend** rodando (Node.js + Express + PostgreSQL/Supabase)

---

## 🚀 Instalação Rápida

### 1. Clonar e Instalar Dependências

```bash
git clone https://github.com/seu-usuario/josedecorando.git
cd josedecorando
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie `.env` na raiz do projeto (ou copie de `.env.example`):

```env
# Para desenvolvimento local
EXPO_PUBLIC_API_URL=http://localhost:3000

# Para produção (Render/Heroku)
# EXPO_PUBLIC_API_URL=https://api-jose-jhbt.onrender.com

# Debug
EXPO_PUBLIC_DEBUG=false
EXPO_PUBLIC_ENV=development
```

### 3. Inicie a Aplicação

```bash
npm start
```

Escolha uma opção:
- **i** para iOS simulator
- **a** para Android emulator
- **w** para web (limitado)
- Escanear QR code com **Expo Go app** no celular

---

## 📱 Telas Disponíveis

### 🎈 **Início (Dashboard)**
- Resumo geral de vendas, faturamento e estoque
- Totais de clientes, produtos e locações ativas
- Resumo de PIX e dinheiro recebido
- Atualizar em tempo real com pull-to-refresh

### 📦 **Produtos**
- Listar produtos com filtro de busca
- Cadastrar novo produto com nome, preço, custo e estoque
- Editar produtos existentes
- Excluir produtos
- Atualizar quantidade em tempo real

### 🔄 **Movimentações**
- Histórico de entrada/saída de estoque
- Filtrado por data
- Origem da movimentação (venda, locação, ajuste)
- Valores unitários

### 📊 **Relatórios**
- **Financeiro Completo**: PIX, dinheiro, débitos, créditos
- **Vendas**: Total de vendas, faturamento, ticket médio
- **Locações**: Ativas, devolvidas, atrasadas, canceladas
- **Produtos**: Total e valor de estoque

---

## 🔐 Autenticação

### Fluxo de Login
1. Usuário insere **email** e **senha**
2. Token é salvo em **AsyncStorage**
3. Token é enviado em todos os requests no header: `Authorization: Bearer {token}`
4. Ao logout, token é removido e usuário retorna para tela de login

### Fluxo de Registro
1. Usuário preenche **nome**, **email**, **senha**
2. Conta é criada no backend com perfil "vendedor"
3. Usuário é automaticamente logado

### Token Expirado
Se o token expirar (401):
- Token é removido
- Usuário é redirecionado para login
- Deve fazer login novamente

---

## 🔌 Integração com API

### Endpoints Utilizados

#### Autenticação
```javascript
POST /api/auth/login      // Login
POST /api/auth/register   // Registrar
GET  /api/auth/me         // Dados do usuário logado
```

#### Produtos
```javascript
GET    /api/produtos      // Listar todos
GET    /api/produtos/:id  // Detalhe
POST   /api/produtos      // Criar
PUT    /api/produtos/:id  // Editar
DELETE /api/produtos/:id  // Excluir
```

#### Clientes
```javascript
GET    /api/clientes      // Listar
POST   /api/clientes      // Criar
```

#### Vendas
```javascript
GET    /api/vendas        // Listar
POST   /api/vendas        // Criar
```

#### Dashboard
```javascript
GET /api/dashboard/resumo              // Resumo geral
GET /api/dashboard/movimentacao-geral  // Movimentações
GET /api/dashboard/financeiro-completo // Financeiro
GET /api/dashboard/vendas-relatorio    // Relatório de vendas
GET /api/dashboard/locacoes-relatorio  // Relatório de locações
GET /api/dashboard/produtos-relatorio  // Relatório de produtos
```

---

## 📁 Estrutura de Pastas

```
josedecorando/
├── app/                          # Expo Router (não usado neste fluxo)
├── src/
│   ├── api/
│   │   └── api.ts               # Configuração Axios + interceptadores
│   ├── components/
│   │   ├── Cards.tsx            # Componentes de card reutilizáveis
│   │   ├── Modals.tsx           # Modais (confirmar, alerta, loading)
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.ts       # Estado global de autenticação
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Tela de login/registro
│   │   ├── DashboardScreen.tsx  # Dashboard inicial
│   │   ├── ProductsScreen.tsx   # Gestão de produtos
│   │   ├── MovementsScreen.tsx  # Movimentações de estoque
│   │   └── ReportsScreen.tsx    # Relatórios
│   ├── types/
│   │   └── api.ts              # Tipos TypeScript
│   └── utils/
│       └── formatting.ts        # Funções de formatação
├── .env                         # Variáveis de ambiente
├── App.tsx                      # Ponto de entrada + navegação
├── app.json                     # Configuração Expo
└── package.json
```

---

## 🎨 Design & Styling

- **NativeWind**: Tailwind CSS para React Native
- **Cores**: Indigo (primário), Purple, Emerald, Red
- **Icons**: Emojis e símbolos Unicode
- **Responsive**: Adapta-se a qualquer tamanho de tela

---

## 🐛 Troubleshooting

### "Network request failed"
- Verifique se a API está rodando em `localhost:3000`
- Ou configure `EXPO_PUBLIC_API_URL` para o endereço correto
- Teste com: `curl http://localhost:3000/health`

### "Unauthorized (401)"
- Token expirou ou inválido
- Faça login novamente
- Verifique se o email/senha estão corretos

### "Connection refused"
- API não está accessible
- Verifique firewall/proxy
- Teste conexão com `ping` ou `curl`

### Erros de build
```bash
npm install                 # Reinstalar dependências
npx expo prebuild --clean   # Limpar cache
npm start -- --clear        # Limpar cache do Metro bundler
```

---

## 📦 Dependências Principais

| Pacote | Descrição |
|--------|-----------|
| `axios` | Client HTTP |
| `@react-native-async-storage` | Armazenamento local |
| `@react-navigation` | Navegação entre telas |
| `expo-linear-gradient` | Gradientes de cor |
| `nativewind` | Tailwind CSS |
| `expo` | Framework React Native |

---

## 🚀 Deploy

### Publicar no Expo
```bash
eas build --platform all
eas submit --platform ios --latest
eas submit --platform android --latest
```

### Gerar APK para Android
```bash
eas build --platform android --local
```

---

## 📞 Suporte

Para problemas:
1. Verifique a API está rodando
2. Consulte os logs em `EXPO_PUBLIC_DEBUG=true`
3. Abra issue no repositório

---

## 📄 Licença

MIT - Código aberto para uso livre.

---

**Desenvolvido com ❤️ para José Decorando Encantando**
