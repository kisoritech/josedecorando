import axios from 'axios';

const API_URL = 'https://api-jose-jhbt.onrender.com';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  responseTime?: number;
}

// Função para testar conectividade
async function testApiConnection(): Promise<void> {
  console.log('🔍 Iniciando testes de conexão com a API...\n');
  console.log(`📍 URL Base: ${API_URL}\n`);

  const results: ApiTestResult[] = [];

  // Teste 1: Verificar se a API está respondendo
  try {
    console.log('1️⃣  Testando conexão básica...');
    const startTime = Date.now();
    
    const instance = axios.create({
      baseURL: API_URL,
      timeout: 15000,
    });

    // Tenta acessar um endpoint que pode não exigir autenticação
    try {
      const response = await instance.get('/api/health');
      const responseTime = Date.now() - startTime;
      
      results.push({
        endpoint: '/api/health',
        method: 'GET',
        status: 'success',
        message: 'API respondendo (Health Check)',
        responseTime,
      });
      
      console.log('   ✅ API está respondendo\n');
    } catch (healthError: any) {
      // Se /api/health não existir, tenta outro endpoint
      if (healthError.response?.status === 404) {
        console.log('   ⚠️  Endpoint /api/health não encontrado, testando alternativas...\n');
        
        // O health check pode não existir, mas a API pode estar ok
        results.push({
          endpoint: '/api/health',
          method: 'GET',
          status: 'pending',
          message: 'Endpoint não encontrado (pode ser normal)',
        });
      } else {
        throw healthError;
      }
    }
  } catch (error: any) {
    results.push({
      endpoint: '/api/health',
      method: 'GET',
      status: 'error',
      message: `Erro de conexão: ${error.message}`,
    });
    
    console.log('   ❌ Erro ao conectar na API');
    console.log(`   Detalhes: ${error.message}\n`);
  }

  // Teste 2: Verificar endpoints sem autenticação
  console.log('2️⃣  Testando acesso a endpoints...');
  
  const testEndpoints = [
    { path: '/api/auth/login', method: 'POST', requiresAuth: false },
    { path: '/api/auth/register', method: 'POST', requiresAuth: false },
  ];

  for (const endpoint of testEndpoints) {
    try {
      const instance = axios.create({
        baseURL: API_URL,
        timeout: 15000,
      });

      const startTime = Date.now();

      if (endpoint.method === 'POST') {
        // Envia requisição POST com dados inválidos apenas para testar conectividade
        try {
          await instance.post(endpoint.path, {});
        } catch (err: any) {
          // Esperamos erro de validação, não de conexão
          if (err.response?.status === 400 || err.response?.status === 401 || err.response?.status === 422) {
            // A API respondeu com erro de validação = está funcionando
            const responseTime = Date.now() - startTime;
            results.push({
              endpoint: endpoint.path,
              method: endpoint.method,
              status: 'success',
              message: 'Endpoint acessível (retornou erro esperado de validação)',
              responseTime,
            });
            console.log(`   ✅ ${endpoint.method} ${endpoint.path}`);
          } else {
            throw err;
          }
        }
      }
    } catch (error: any) {
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        status: 'error',
        message: `Erro: ${error.message}`,
      });
      
      console.log(`   ❌ ${endpoint.method} ${endpoint.path}`);
      console.log(`      Detalhes: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DOS TESTES\n');

  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  const pending = results.filter(r => r.status === 'pending').length;

  console.log(`✅ Sucesso: ${successful}`);
  console.log(`❌ Erro: ${failed}`);
  console.log(`⚠️  Pendente: ${pending}`);

  if (failed > 0) {
    console.log('\n🔴 RECOMENDAÇÕES:');
    console.log('1. Verifique se a URL da API está correta no .env');
    console.log('2. Verifique se a API está rodando em https://api-jose-jhbt.onrender.com');
    console.log('3. Verifique a configuração de CORS na API');
    console.log('4. Verifique logs da API em https://dashboard.render.com');
    console.log('5. Tente fazer um teste manual em https://api-jose-jhbt.onrender.com/api/auth/login');
  } else {
    console.log('\n🟢 A API está respondendo corretamente!');
  }

  console.log('\n' + '='.repeat(50));
}

// Executar os testes
testApiConnection().catch(console.error);
