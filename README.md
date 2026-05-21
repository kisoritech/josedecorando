# 🎈 JDE - José Decorando Encantando
## Aplicativo Mobile - React Native + Expo

Aplicação mobile completa para gestão de clientes, produtos, vendas, locações, estoque, transações e relatórios financeiros.

---

## 🚀 Comece Agora

### 1️⃣ **Instale Dependências**
```bash
npm install
```

### 2️⃣ **Inicie a Aplicação**
```bash
npm start
```

### 3️⃣ **Abra no Dispositivo**
- **Android**: Pressione `a`
- **iOS**: Pressione `i`
- **Celular**: Escanear QR code com Expo Go

### 4️⃣ **Faça Login**
Use um usuário válido cadastrado na API configurada em `.env`.

> Observação: as credenciais antigas `teste@email.com` / `123456` foram testadas em 21/05/2026 e a API retornou `Credenciais invalidas`.

✅ **Pronto!** Você está dentro do app.

---

## 📚 Documentação Completa

### 🏃 **Começar Rápido** (5 minutos)
→ [WELCOME.md](WELCOME.md) - Boas-vindas e contexto  
→ [QUICKSTART.md](QUICKSTART.md) - Guia de 5 minutos

### 📖 **Entender a Aplicação** (20 minutos)
→ [MOBILE_README.md](MOBILE_README.md) - Documentação completa  
→ [ARCHITECTURE.md](ARCHITECTURE.md) - Visão técnica

### 🧪 **Testar e Validar** (30 minutos)
→ [TESTING_MOBILE.md](TESTING_MOBILE.md) - Guia de testes  
→ [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) - Checklist final

### ✍️ **Desenvolvimento** (20 minutos)
→ [BEST_PRACTICES.md](BEST_PRACTICES.md) - Padrões de código  
→ [SETUP_SUMMARY.md](SETUP_SUMMARY.md) - Resumo técnico

---

## 🎯 O que o App Faz?

### 📊 **Dashboard**
- Resumo geral de vendas, faturamento e estoque
- Totais de clientes, produtos e locações ativas
- Resumo de PIX e dinheiro recebido

### 📦 **Produtos**
- Listar, buscar, criar, editar e excluir produtos
- Gerenciar quantidade em estoque
- Acompanhar preço de venda e custo

### 🔄 **Movimentações**
- Histórico completo de entrada/saída de estoque
- Filtrado por tipo, data e origem
- Atualização em tempo real

### 📊 **Relatórios**
- Financeiro: PIX, dinheiro, débitos, créditos
- Vendas: total, faturamento, ticket médio
- Locações: ativas, devolvidas, atrasadas
- Produtos: total e valor de estoque

---

## 🛠️ Tech Stack

| Tecnologia | Versão | Propósito |
|---|---|---|
| **React Native** | 0.73+ | Framework mobile |
| **Expo** | 50+ | Plataforma de desenvolvimento |
| **TypeScript** | 5.x | Type safety |
| **React Navigation** | 6.x | Navegação entre telas |
| **Axios** | 1.x | Client HTTP |
| **Context API** | 18+ | Estado global |
| **NativeWind** | 4.x | Tailwind CSS |
| **AsyncStorage** | 1.x | Armazenamento local |

---

## 📁 Estrutura de Pastas

```
josedecorando/
├── src/
│   ├── screens/              # 5 Telas principais
│   ├── context/              # Autenticação (AuthContext)
│   ├── api/                  # Axios + Interceptadores
│   ├── components/           # Modals, Cards
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Funções auxiliares
├── .env                       # Configuração
├── App.tsx                    # Ponto de entrada
├── app.json                   # Configuração Expo
└── 📚 Documentação completa
```

---

## 🔐 Autenticação

O app usa **JWT (JSON Web Tokens)**:
- ✅ Login com email/senha
- ✅ Token armazenado em AsyncStorage
- ✅ Injetado automaticamente em requisições
- ✅ Logout automático em 401

---

## 🔌 Integração com API

A app se integra com uma **API Node.js + Express**:

### Endpoints Utilizados
- `POST /api/auth/login` - Autenticação
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Editar produto
- `DELETE /api/produtos/:id` - Deletar produto
- `GET /api/dashboard/*` - Relatórios
- ...e muito mais

### Configuração
Edite `.env`:
```env
EXPO_PUBLIC_API_URL=https://api-jose-jhbt.onrender.com
```

---

## 🚀 Próximos Passos

### Para Usar a App
1. Leia [WELCOME.md](WELCOME.md)
2. Execute `npm start`
3. Teste em emulador

### Para Desenvolver
1. Leia [ARCHITECTURE.md](ARCHITECTURE.md)
2. Leia [BEST_PRACTICES.md](BEST_PRACTICES.md)
3. Comece a codificar

### Para Publicar
1. Leia [TESTING_MOBILE.md](TESTING_MOBILE.md)
2. Execute testes completos
3. Build para produção

---

## 🆘 Suporte Rápido

| Problema | Solução |
|----------|---------|
| App não inicia | `npm start -- --clear` |
| Erro de compilação | `npm install` |
| Conexão recusada | Verifique API em localhost:3000 |
| Erro de autenticação | Verifique `.env` |

---

## 📞 Recursos Úteis

### Documentação
- [React Native](https://reactnative.dev)
- [Expo](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript](https://www.typescriptlang.org)

### Ferramentas
- [Postman](https://www.postman.com) - Testar API
- [VS Code](https://code.visualstudio.com) - Editor
- [Android Studio](https://developer.android.com/studio) - Android

---

## 📝 Contribuindo

Siga os padrões em [BEST_PRACTICES.md](BEST_PRACTICES.md):
- Nomes em PascalCase/camelCase
- TypeScript strict mode
- Comentários em JSDoc
- Commits descritivos

---

## 📄 Licença

MIT - Código aberto para uso livre

---

## 🎉 Desenvolvido com ❤️

**Desenvolvido para José Decorando Encantando**

Versão: **1.0.0**  
Data: **17/05/2026**  
Status: **Production Ready** ✅

---

**[👉 Comece aqui - WELCOME.md](WELCOME.md)**

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
