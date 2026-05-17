# 🧪 Guia de Testes - Aplicação Mobile + API

Este documento fornece guias de teste passo-a-passo para validar a integração entre a aplicação mobile React Native e a API Node.js.

---

## 📋 Checklist de Verificação

### 1️⃣ **Ambiente Local**
- [ ] API rodando em `http://localhost:3000`
- [ ] PostgreSQL/Supabase conectado
- [ ] `.env` configurado corretamente no mobile
- [ ] Expo metro bundler iniciado (`npm start`)

### 2️⃣ **Verificações de Conectividade**

#### API Health Check
```bash
curl http://localhost:3000/health
# Resposta esperada: { "status": "OK" }
```

#### Teste de Rede
No app, tente fazer login com dados inválidos:
- Deve receber erro de autenticação
- Não deve dar erro de rede

---

## 🔐 **Teste de Autenticação**

### Criar Conta
1. Abra app
2. Na tela de login, clique em "Criar Conta"
3. Preencha:
   - Nome: "Teste User"
   - Email: "teste@email.com"
   - Senha: "123456"
4. Clique em "Registrar"
5. ✅ **Esperado**: Usuário criado e logado automaticamente

### Fazer Login
1. Faça logout (menu)
2. Preencha:
   - Email: "teste@email.com"
   - Senha: "123456"
3. Clique em "Entrar"
4. ✅ **Esperado**: Acesso ao dashboard

### Token Persistência
1. Faça logout
2. Feche o app completamente
3. Reabra o app
4. ✅ **Esperado**: Deve estar logado automaticamente (token salvo)

### Token Expirado
1. Modifique o token em Debug Console
2. Tente fazer requisição
3. ✅ **Esperado**: 401 error, redirecionamento para login

---

## 📊 **Teste de Dashboard**

### Verificar Dados
1. Vá para aba "Início"
2. Observe:
   - Total de produtos
   - Total de clientes
   - Faturamento total
   - Totais de PIX e dinheiro

### Pull-to-Refresh
1. Puxe a tela para baixo
2. ✅ **Esperado**: Dashboard atualiza os dados

### Teste com Dados Vazios
1. Se não há dados no banco:
   - Total de produtos: 0
   - Faturamento: R$ 0,00

---

## 📦 **Teste de Produtos**

### Listar Produtos
1. Vá para aba "Produtos"
2. ✅ **Esperado**: Lista de produtos carrega

### Buscar Produto
1. Digite no campo de busca: "Caixa"
2. ✅ **Esperado**: Filtra produtos em tempo real

### Criar Novo Produto
1. Clique em "+" flutuante
2. Preencha:
   - Nome: "Caixa de Som"
   - Preço Venda: "199.90"
   - Preço Custo: "100.00"
   - Quantidade: "5"
3. Clique em "Salvar"
4. ✅ **Esperado**: Produto aparece na lista

### Editar Produto
1. Toque em um produto
2. Clique em "Editar"
3. Altere o preço para "249.90"
4. Clique em "Salvar"
5. ✅ **Esperado**: Produto atualizado na lista

### Excluir Produto
1. Toque em um produto
2. Clique em "Excluir"
3. Confirme a exclusão
4. ✅ **Esperado**: Produto removido da lista

---

## 🔄 **Teste de Movimentações**

### Verificar Histórico
1. Vá para aba "Movimentações"
2. ✅ **Esperado**: Mostra entradas/saídas de estoque

### Verificar Tipos
- Deve mostrar movimentos com:
  - Tipo: Entrada (verde) ou Saída (vermelho)
  - Data da movimentação
  - Quantidade
  - Valor unitário (se disponível)

### Atualizar Lista
1. Crie um produto com quantidade inicial
2. Volte para Movimentações
3. Puxe para atualizar
4. ✅ **Esperado**: Novo movimento aparece

---

## 📊 **Teste de Relatórios**

### Carregar Relatórios
1. Vá para aba "Relatórios"
2. ✅ **Esperado**: 4 cards carregam (Financeiro, Vendas, Locações, Produtos)

### Financeiro
- Deve mostrar:
  - Total de lançamentos
  - Total pago
  - Débitos e créditos
  - PIX e dinheiro

### Vendas
- Deve mostrar:
  - Total de vendas
  - Faturamento total
  - Ticket médio

### Locações
- Deve mostrar:
  - Total de locações
  - Ativas
  - Atrasadas

### Produtos
- Deve mostrar:
  - Total de produtos
  - Valor de estoque

---

## 🔗 **Testes de Integração API**

### Criar Venda (via API)
```bash
curl -X POST http://localhost:3000/api/vendas \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "forma_pagamento": "PIX",
    "frete_valor": "10.00",
    "itens": [
      {
        "produto_id": 1,
        "quantidade": 2,
        "valor_unitario": 50.00
      }
    ]
  }'
```

### Verificar no Dashboard
1. Vá para "Início"
2. Puxe para atualizar
3. ✅ **Esperado**: Faturamento total aumentou

### Criar Locação (via API)
```bash
curl -X POST http://localhost:3000/api/locacoes \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 1,
    "cliente_id": 1,
    "quantidade": 1,
    "valor_unitario": "200.00",
    "data_inicio": "2026-05-17T10:00:00Z",
    "data_prevista_devolucao": "2026-05-24T10:00:00Z"
  }'
```

### Verificar no Dashboard
1. Vá para "Início"
2. ✅ **Esperado**: Locações ativas aumentou

---

## 🚨 **Testes de Erro**

### Rede Indisponível
1. Desligue internet do dispositivo
2. Tente fazer qualquer ação
3. ✅ **Esperado**: Mensagem de erro de rede

### Campos Inválidos
1. Tente criar produto sem nome
2. ✅ **Esperado**: Mensagem "Nome é obrigatório"

### Valores Negativos
1. Tente criar produto com preço negativo
2. ✅ **Esperado**: Mensagem "Preço deve ser positivo"

### Quantidade Inválida
1. Tente criar com quantidade em texto
2. ✅ **Esperado**: Converte para número ou erro

---

## 📱 **Testes em Diferentes Dispositivos**

### iOS Simulator
```bash
npm start
# Pressione 'i'
```

### Android Emulator
```bash
npm start
# Pressione 'a'
```

### Dispositivo Físico
```bash
npm start
# Escanear QR code com Expo Go
```

### Web (limitado)
```bash
npm start
# Pressione 'w'
```

---

## 🔍 **Debug**

### Ativar Debug Mode
No `.env`:
```env
EXPO_PUBLIC_DEBUG=true
```

### Ver Logs de Rede
```bash
# No DevTools (Ctrl+Shift+D no app)
# Verifique: Network tab
```

### Inspecionar Storage
```javascript
// Console do DevTools
AsyncStorage.getAllKeys().then(keys => {
  AsyncStorage.multiGet(keys).then(result => {
    console.log(result);
  });
});
```

---

## ✅ **Checklist Final**

### Antes de Publicar
- [ ] Login/Registro funcionam
- [ ] Dashboard carrega dados
- [ ] Produtos lista/cria/edita/deleta
- [ ] Movimentações atualizam
- [ ] Relatórios carregam
- [ ] Logout funciona
- [ ] Token persiste
- [ ] Tratamento de erros adequado
- [ ] Sem logs de erro no console
- [ ] .env configurado para produção

---

## 📞 **Suporte**

Se algo não funcionar:
1. Verifique se API está rodando
2. Veja os logs da API
3. Teste endpoints com Postman/curl
4. Verifique token no AsyncStorage
5. Limpe cache: `npm start -- --clear`

---

**Última atualização**: 17/05/2026
