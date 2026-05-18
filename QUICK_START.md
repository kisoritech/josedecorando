# 🚀 GUIA RÁPIDO - JDE Venda

## ✅ Verificação em 3 Passos

### Passo 1: Health Check
```bash
node scripts/health-check.js
```
Tudo deve estar ✅ (verde)

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Iniciar App
```bash
expo start --clear
```

Pronto! 🎉

---

## 📱 Testando

1. **Login**
   - Insira email e senha válidos
   - Verifique console para logs `[Auth] Login realizado com sucesso`

2. **Dashboard**
   - Deve carregar dados de resumo
   - Log: `[API Response] 200 - /api/dashboard/resumo`

3. **Produtos**
   - Deve listar produtos
   - Log: `[API Response] 200 - /api/produtos`

---

## 🐛 Se Houver Erro

1. **Abra Console:**
   - Web: `F12`
   - Mobile: `adb logcat`

2. **Procure por `[API Error]`**

3. **Consult: `TROUBLESHOOTING.md`**

---

## 🔗 API

URL: `https://api-jose-jhbt.onrender.com`

Verificar se está online:
```bash
curl https://api-jose-jhbt.onrender.com/api/health
```

---

## 📚 Documentos

- `VERIFICATION_SUMMARY.md` - Resumo detalhado
- `TROUBLESHOOTING.md` - Problemas e soluções
- `API_ENDPOINTS.md` - Lista de endpoints
- `src/utils/api-config-checker.ts` - Verificador

---

## 🎯 Estrutura Atual

```
App → AuthProvider → LoginScreen/DashboardScreen
                    ↓
                  api.ts (axios)
                    ↓
            https://api-jose-jhbt.onrender.com
```

Todos os endpoints estão apontando corretamente para a API!

---

**Desenvolvido em:** 18 de maio de 2026
**Status:** ✅ Pronto para usar
