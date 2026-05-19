# 🔧 Guia de Configuração e Testes

## 1️⃣ Pré-requisitos

```bash
# Node.js 18+
node --version

# Expo CLI
npm install -g expo-cli

# Dependências do projeto
cd josedecorando
npm install
```

## 2️⃣ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_API_TIMEOUT=15000
EXPO_PUBLIC_DEBUG=true
```

**Importante**: 
- Mude `http://localhost:3000` para a URL real da sua API
- Se estiver testando no celular, use o IP da máquina: `http://192.168.X.X:3000`

## 3️⃣ Iniciando o Projeto

```bash
# Iniciar Expo
npm start

# No menu Expo, escolha:
# - 'i' para iOS
# - 'a' para Android  
# - 'w' para Web
```

## 4️⃣ Fluxo de Teste Completo

### ✅ TESTE 1: Login
1. App abre mostrando LoginScreen
2. Insira email e senha válidos
3. Click "Entrar"
4. **Esperado**: Navegação para Dashboard + carregamento de dados

```
Erros comuns:
- "Erro de conexão": Verifique se API está rodando
- "Email ou senha incorretos": Credenciais inválidas
- "Network timeout": API está muito lenta (aumentar EXPO_PUBLIC_API_TIMEOUT)
```

### ✅ TESTE 2: Dashboard
1. Dashboard mostra:
   - ✅ Nome do usuário no topo
   - ✅ Faturamento Total
   - ✅ Quantidade de Produtos
   - ✅ Quantidade de Clientes
   - ✅ Locações Ativas
   - ✅ Pagamentos (PIX + Dinheiro)

2. Pull-to-refresh funciona:
   - Deslize para baixo
   - Dados devem recarregar

```
Se nada carregar:
- Verifique console: npm start → logs
- Procure por erros de API: [API Error]
- Verifique token em AsyncStorage: dev tools
```

### ✅ TESTE 3: Produtos
1. Click na aba "Produtos" 
2. Lista de produtos carrega
3. Buscar produtos funciona (texto em tempo real)
4. Click "+" para adicionar novo (modal abre)

```
Dados esperados:
- Nome do produto
- Preço de venda
- Preço de custo
- Quantidade em estoque
```

### ✅ TESTE 4: Movimentações
1. Click na aba "Movimentos"
2. Lista de entradas/saídas carrega
3. Mostra:
   - ✅ Nome do produto
   - ✅ Tipo (entrada/saída)
   - ✅ Quantidade
   - ✅ Data

```
Cores:
- 🟢 Verde = Entrada
- 🔴 Vermelho = Saída
```

### ✅ TESTE 5: Relatórios
1. Click na aba "Relatórios"
2. 4 abas carregam:
   - 💰 Financeiro
   - 📈 Vendas
   - 📦 Locações
   - 🛍️ Produtos

3. Click em cada aba para ver dados específicos

### ✅ TESTE 6: Sincronização de Dados
1. No Dashboard, note o número de produtos: "10"
2. Va para Produtos, veja a lista
3. Volte para Dashboard
4. **Esperado**: Número permanece "10" (dados compartilhados)

## 5️⃣ Debugging

### Ver logs detalhados
```
Defina EXPO_PUBLIC_DEBUG=true no .env
Procure por [API], [Auth], [Data] nos logs
```

### Inspecionar AsyncStorage
```typescript
// No console do Expo DevTools:
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.getItem('auth_token');
await AsyncStorage.getItem('user_data');
```

### Limpar cache/dados
```bash
npm run reset-project
# Limpa todo o estado do app e reconstrói
```

### Ver estrutura de componentes
```
Abra React Native Debugger (if installed)
Ou use Expo DevTools built-in
```

## 6️⃣ Problemas Comuns

### ❌ "Cannot find module 'DataContext'"
**Solução**: Execute `npm install` novamente

### ❌ "API_URL is undefined"
**Solução**: Verifique `.env` está na raiz do projeto e contém `EXPO_PUBLIC_API_URL`

### ❌ App fecha ao fazer login
**Solução**: Verifique console para erros. Procure por:
- Erro no AuthContext.tsx
- Resposta da API inválida
- Token não salvo em AsyncStorage

### ❌ Dados não carregam no Dashboard
**Solução**:
1. Verifique se API está rodando: `curl http://localhost:3000/api/dashboard/resumo`
2. Verifique se token é válido
3. Verifique timeout: `EXPO_PUBLIC_API_TIMEOUT=30000` (aumentar)

### ❌ "useData deve ser usado dentro de um DataProvider"
**Solução**: Certifique-se que o componente está dentro da árvore do DataProvider (já deve estar em App.tsx)

## 7️⃣ Verificar Conexão API

```bash
# Teste endpoint do dashboard
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/api/dashboard/resumo

# Teste login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@test.com","password":"123456"}'
```

## 8️⃣ Performance

### Melhorias já implementadas:
- ✅ Cache de dados no contexto
- ✅ Requisições paralelas (Promise.all)
- ✅ Refresh controlado
- ✅ Error boundaries

### Próximas melhorias:
- [ ] LocalStorage cache
- [ ] Infinite scroll em listas
- [ ] Skeleton screens
- [ ] Lazy loading de imagens

## 9️⃣ Deploy/Produção

Antes de fazer deploy:
1. Mude `EXPO_PUBLIC_API_URL` para URL de produção
2. Mude `EXPO_PUBLIC_DEBUG=false`
3. Teste todas as telas
4. Valide responses da API
5. Teste offline behavior

```bash
# Build Android
eas build --platform android

# Build iOS
eas build --platform ios

# Publicar no Expo
eas submit --platform android
eas submit --platform ios
```

---

**📞 Precisa de ajuda?**
- Verifique REFACTORING_SUMMARY.md para estrutura detalhada
- Console logs com prefixo [API], [Auth], [Data]
- Teste endpoints da API isoladamente
