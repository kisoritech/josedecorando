# 🚀 Quick Start Guide - JDE Mobile

Guia rápido para começar a usar o aplicativo em 5 minutos.

---

## ⚡ **5 Minutos de Setup**

### 1️⃣ **Clonar e Instalar** (1 min)
```bash
cd josedecorando
npm install
```

### 2️⃣ **Configurar .env** (30 segundos)
```bash
# Arquivo já criado em .env com padrão desenvolvimento
# Se precisar mudar, edite:
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ **Iniciar Expo** (1 min)
```bash
npm start
```

### 4️⃣ **Abrir no Dispositivo** (1.5 min)
- **Android**: Pressione `a`
- **iOS**: Pressione `i`
- **Celular**: Escanear QR code com Expo Go

### 5️⃣ **Fazer Login** (30 segundos)
```
Email: teste@email.com
Senha: 123456
```

✅ **Pronto!** Você está dentro do app.

---

## 🎮 **Uso Rápido**

### Navegar entre Telas
- **Swipe horizontal** ou **toque nas abas inferior**
- 🎈 Início
- 📦 Produtos
- 🔄 Movimentações
- 📊 Relatórios

### Criar Produto
1. Vá para **Produtos**
2. Clique no **botão "+" flutuante**
3. Preencha os dados
4. Clique em **Salvar**

### Atualizar Dashboard
1. Vá para **Início**
2. **Puxe para baixo** (pull-to-refresh)

### Ver Relatórios
1. Vá para **Relatórios**
2. Observe os **4 cards principais**

---

## 🔐 **Contas de Teste**

### Criar Nova Conta
1. Na tela de login, clique em **"Criar Conta"**
2. Preencha nome, email, senha
3. Clique em **"Registrar"**

### Conta Padrão
```
Email: teste@email.com
Senha: 123456
```

---

## 📡 **API Necessária**

A API deve estar rodando:

```bash
# Verificar se API está ok
curl http://localhost:3000/health
# Resposta esperada: { "status": "OK" }
```

Se der erro:
- Verifique se API está rodando em `http://localhost:3000`
- Ou mude `EXPO_PUBLIC_API_URL` no `.env`

---

## 🛠️ **Comandos Úteis**

```bash
# Iniciar com cache limpo
npm start -- --clear

# Resetar projeto
npm run reset-project

# Verificar erros
npm run lint

# Instalar dependência nova
npm install axios
```

---

## 📂 **Arquivos Principais**

| Arquivo | O que faz |
|---------|----------|
| `App.tsx` | Navegação + Context |
| `src/screens/*.tsx` | 5 telas principais |
| `src/context/AuthContext.ts` | Gerenciar login |
| `src/api/api.ts` | Comunicar com API |
| `.env` | Variáveis de configuração |

---

## 🎯 **Próximas Ações**

### Para Desenvolver
1. Abra `src/screens/` para editar telas
2. Abra `src/api/` para ajustar requisições
3. Abra `.env` para trocar URL da API

### Para Entender Melhor
1. Leia `MOBILE_README.md` - Documentação completa
2. Leia `TESTING_MOBILE.md` - Como testar
3. Leia `BEST_PRACTICES.md` - Padrões de código

### Para Debugar
```bash
# Ativar debug
# No .env: EXPO_PUBLIC_DEBUG=true

# Ver logs
# Pressione Ctrl+Shift+D no app
```

---

## 🆘 **Problemas Rápidos**

### "Network request failed"
```bash
# Verifique se API está rodando
curl http://localhost:3000/health

# Se não, inicie a API em outro terminal
cd ../backend
npm start
```

### "Cannot find module"
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### App Travado
```bash
# Limpe cache e reinicie
npm start -- --clear
# Pressione 'r' no terminal
```

### Erro de Compilação TypeScript
```bash
# Verifique arquivo aberto
# Veja a aba "Problems" no VS Code
# Ou rode: npx tsc --noEmit
```

---

## 📚 **Onde Encontrar**

| Preciso de... | Arquivo |
|---|---|
| Como usar app | `MOBILE_README.md` |
| Como testar | `TESTING_MOBILE.md` |
| Padrões código | `BEST_PRACTICES.md` |
| Resumo completo | `SETUP_SUMMARY.md` |
| API endpoints | `TESTING_GUIDE.md` (backend) |

---

## 🎓 **Próximos Passos Recomendados**

### Nível 1: Usuário
- [ ] Fazer login
- [ ] Navegar entre telas
- [ ] Ver dashboard
- [ ] Criar um produto

### Nível 2: Testador
- [ ] Testar cada tela
- [ ] Criar múltiplos produtos
- [ ] Ver relatórios
- [ ] Verificar movimentações

### Nível 3: Desenvolvedor
- [ ] Entender código
- [ ] Adicionar nova tela
- [ ] Criar novo endpoint
- [ ] Fazer pull request

---

## 🚀 **Deploy Rápido**

### Web Interativa
```bash
npm start
# Pressione 'w'
```

### Android APK
```bash
eas build --platform android --local
```

### App Store (iOS)
```bash
eas build --platform ios
eas submit --platform ios
```

---

## 💡 **Tips & Tricks**

### Recarregar App
- Android: Pressione 'r' no terminal
- iOS: Cmd+R no simulator
- Celular: Shake device + Reload

### Inspecionar Estado
```javascript
// No console Expo DevTools:
AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(console.log);
});
```

### Inspecionar Requisições
- Abra Expo DevTools (Ctrl+Shift+D)
- Vá em "Network"
- Veja todas as requisições

---

## ✅ **Checklist Antes de Publicar**

- [ ] .env configurado para produção
- [ ] Nenhum console.log() com dados sensíveis
- [ ] Sem tokens hardcoded
- [ ] Testado em dispositivo real
- [ ] Dark mode testado
- [ ] Offline handling testado
- [ ] Mensagens de erro são amigáveis

---

## 📞 **Suporte Rápido**

| Problema | Solução |
|----------|---------|
| "Não conecta na API" | Verifique `EXPO_PUBLIC_API_URL` no `.env` |
| "Login não funciona" | Verifique se usuário existe (crie novo) |
| "App congelado" | Pressione 'r' ou limpe cache |
| "Erro estranho" | Limpe `node_modules` e reinstale |
| "TypeScript error" | Verifique tipos em `src/types/api.ts` |

---

## 🎉 **Tudo Pronto!**

Você agora tem:
- ✅ App mobile completo
- ✅ Autenticação funcional
- ✅ 5 telas principais
- ✅ Integração com API
- ✅ Documentação completa
- ✅ Exemplos de testes

**Bora desenvolver! 🚀**

---

**Última atualização**: 17/05/2026
**Versão**: 1.0.0
