# 🔧 GUIA DE TROUBLESHOOTING - JDE Venda

## 🚀 Verificação Rápida

### 1. Verificar Configuração do .env
```bash
# O .env deve conter:
EXPO_PUBLIC_API_URL=https://api-jose-jhbt.onrender.com
EXPO_PUBLIC_API_TIMEOUT=15000
EXPO_PUBLIC_DEBUG=false
EXPO_PUBLIC_ENV=development
```

### 2. Limpar Cache e Reinstalar
```bash
# Limpar dependências
npm install

# Limpar cache do Expo
expo start --clear

# Ou em um terminal:
watchman watch-del-all
```

### 3. Testar Conectividade da API

#### Método 1: Teste Manual via Terminal
```bash
# Teste se a API está respondendo
curl -X POST https://api-jose-jhbt.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

#### Método 2: Teste via Navegador
- Abra: `https://api-jose-jhbt.onrender.com/api/health`
- Se retornar um erro 404, a API está respondendo (só não tem esse endpoint)
- Se der timeout, a API pode estar desligada

#### Método 3: Usar o Script de Teste (Node.js)
```bash
# Execute o script de teste
node scripts/test-api.ts
```

## 📋 Problemas Comuns e Soluções

### ❌ Erro: "Network Error" ou "Timeout"
**Causas Possíveis:**
1. API está offline (Render.com pode estar hibernando)
2. Internet desconectada
3. Firewall bloqueando requisições
4. CORS não está configurado na API

**Soluções:**
```bash
# 1. Verifique sua internet
ping 8.8.8.8

# 2. Tente acessar a API diretamente
curl https://api-jose-jhbt.onrender.com/api/health

# 3. Se a API é do Render, ela pode estar dormindo
# Acesse manualmente: https://api-jose-jhbt.onrender.com
# Isso vai ativar a instância
```

### ❌ Erro: "401 Unauthorized"
**Causas Possíveis:**
1. Token inválido ou expirado
2. Token não está sendo enviado no header
3. API espera um formato diferente de token

**Soluções:**
```bash
# Verificar se o token está sendo salvo
# Abra DevTools (F12) → Application → Storage → AsyncStorage
# Procure por 'auth_token'

# Se o token não está sendo salvo:
# 1. Faça login novamente
# 2. Verifique os logs da API
```

### ❌ Erro: "404 Not Found"
**Causas Possíveis:**
1. Endpoint não existe na API
2. URL base está incorreta
3. Rota não está implementada no backend

**Soluções:**
1. Verifique se o endpoint existe na API
2. Confirme a URL: `https://api-jose-jhbt.onrender.com`
3. Verifique a documentação dos endpoints em `API_ENDPOINTS.md`

### ❌ Erro: "CORS Error"
**Causas Possíveis:**
1. API não permite requisições do cliente
2. Headers de CORS não estão configurados

**Solução:**
Contate o desenvolvedor da API backend para adicionar:
```javascript
// No backend (Express.js)
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com'],
  credentials: true
}));
```

### ❌ Erro: "Dados inválidos" (422)
**Causas Possíveis:**
1. Validação de dados rejeitou a entrada
2. Campos obrigatórios estão faltando
3. Tipo de dados está incorreto

**Soluções:**
1. Verifique os dados sendo enviados
2. Confirme o formato esperado (tipo, tamanho, etc)
3. Veja os logs do servidor para mais detalhes

## 🔍 Debug Mode

### Ativar Debug Mode
1. Edite `.env`:
   ```
   EXPO_PUBLIC_DEBUG=true
   ```

2. Reinicie o app:
   ```bash
   expo start --clear
   ```

3. Abra o console para ver logs:
   - Web: DevTools (F12)
   - Android: `adb logcat`
   - iOS: Xcode Console

### Logs que você Verá
```
[API Config] URL: https://api-jose-jhbt.onrender.com
[API Config] Timeout: 15000 ms
[API Config] Debug Mode: true
[API Request] POST /api/auth/login
[API Request] Token presente no header
[API Response] 200 - /api/auth/login
[Auth] Login realizado com sucesso
```

## 🧪 Verificação Passo-a-Passo

### 1. Verificar Configuração
```bash
# Abra DevTools do Expo e procure:
# [API Config] URL: https://api-jose-jhbt.onrender.com
# [API Config] Timeout: 15000 ms
```

### 2. Tentar Login
1. Insira credenciais válidas
2. Observe os logs:
   - `[API Request] POST /api/auth/login` - requisição iniciada
   - `[API Response] 200 - /api/auth/login` - sucesso
   - `[Auth] Login realizado com sucesso` - tudo ok

### 3. Testar Endpoints
1. Dashboard deve carregar dados
2. Produtos devem listar
3. Movimentações devem aparecer

## 📞 Checklist de Validação

- [ ] `.env` contém `EXPO_PUBLIC_API_URL=https://api-jose-jhbt.onrender.com`
- [ ] API responde (teste manual)
- [ ] Logs mostram `[API Response]` com status 200
- [ ] Token está sendo salvoe no AsyncStorage
- [ ] Usuário consegue fazer login
- [ ] Dashboard carrega sem erros
- [ ] Endpoints retornam dados esperados

## 🚨 Problemas Avançados

### API Render.com Hibernando
Render.com coloca apps em sleep se não usarem em 15+ minutos.

**Solução:**
1. Acesse a URL da API manualmente
2. Aguarde a instância "acordar"
3. Tente fazer login novamente

### Problemas de HTTPS/SSL
Se ver erro de certificado:
1. Atualize o Node.js e dependencies
2. Execute: `npm install`
3. Limpe cache: `expo start --clear`

### Versão Incompatível do Axios
Se ver erros estranhos com HTTP:
1. Verifique a versão do axios: `npm list axios`
2. Atualize se necessário: `npm install axios@latest`

## 📚 Recursos

- API Docs: [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- Config Checker: [src/utils/api-config-checker.ts](./src/utils/api-config-checker.ts)
- Test Script: [scripts/test-api.ts](./scripts/test-api.ts)

## 💡 Tips

1. **Sempre limpe cache ao fazer mudanças no .env**
2. **Use Debug Mode para investigar problemas**
3. **Verifique logs da API no Render Dashboard**
4. **Teste endpoints manualmente com curl/Postman**
5. **Mantenha tokens seguros em AsyncStorage**
