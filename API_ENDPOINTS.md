# Documentação de Endpoints da API JDE Venda

## Configuração
- **URL Base**: https://api-jose-jhbt.onrender.com
- **Timeout**: 15000ms
- **Ambiente**: Development

## Autenticação
### Endpoints de Auth
- `POST /api/auth/login` - Login com email e password
- `POST /api/auth/register` - Registrar novo usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado

**Headers necessários:**
- `Authorization: Bearer {token}` (para endpoints protegidos)

## Dashboard
### Endpoints de Dashboard
- `GET /api/dashboard/resumo` - Resumo geral do dashboard
- `GET /api/dashboard/movimentacao-geral` - Movimentações de estoque
- `GET /api/dashboard/financeiro-completo` - Relatório financeiro
- `GET /api/dashboard/vendas-relatorio` - Relatório de vendas
- `GET /api/dashboard/locacoes-relatorio` - Relatório de locações
- `GET /api/dashboard/produtos-relatorio` - Relatório de produtos

## Produtos
### Endpoints de Produtos
- `GET /api/produtos` - Listar todos os produtos
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Deletar produto

## Status da Verificação
- [x] Endpoints documentados
- [ ] API respondendo corretamente
- [ ] Autenticação funcionando
- [ ] CORS configurado
- [ ] Timeouts ajustados

## Problemas Conhecidos
1. Verificar conexão com a API
2. Verificar configuração de CORS
3. Validar tokens JWT
