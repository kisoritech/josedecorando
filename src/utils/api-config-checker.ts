// Arquivo de Diagnóstico - Config Checker
// Este arquivo verifica se todas as configurações estão corretas


interface ConfigStatus {
  variable: string;
  expected: string;
  actual: string | undefined;
  status: 'OK' | 'MISSING' | 'INVALID';
  message: string;
}

export function checkApiConfiguration(): ConfigStatus[] {
  const configs: ConfigStatus[] = [];

  // 1. Verificar API_URL
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  configs.push({
    variable: 'EXPO_PUBLIC_API_URL',
    expected: 'https://api-jose-jhbt.onrender.com',
    actual: apiUrl,
    status: apiUrl ? (apiUrl === 'https://api-jose-jhbt.onrender.com' ? 'OK' : 'INVALID') : 'MISSING',
    message: apiUrl 
      ? (apiUrl === 'https://api-jose-jhbt.onrender.com' 
        ? '✅ API URL configurada corretamente'
        : `⚠️  API URL diferente: ${apiUrl}`)
      : '❌ EXPO_PUBLIC_API_URL não está definido',
  });

  // 2. Verificar TIMEOUT
  const timeout = process.env.EXPO_PUBLIC_API_TIMEOUT;
  const timeoutNum = timeout ? parseInt(timeout) : undefined;
  configs.push({
    variable: 'EXPO_PUBLIC_API_TIMEOUT',
    expected: '15000',
    actual: timeout,
    status: timeout && timeoutNum && timeoutNum > 0 ? 'OK' : 'INVALID',
    message: timeout 
      ? (timeoutNum && timeoutNum > 0 
        ? `✅ Timeout configurado: ${timeout}ms`
        : '❌ Timeout inválido')
      : '⚠️  Timeout não definido (usando padrão: 15000ms)',
  });

  // 3. Verificar ENV
  const env = process.env.EXPO_PUBLIC_ENV;
  configs.push({
    variable: 'EXPO_PUBLIC_ENV',
    expected: 'development ou production',
    actual: env,
    status: env ? 'OK' : 'INVALID',
    message: env 
      ? `✅ Ambiente: ${env}`
      : '⚠️  Ambiente não definido',
  });

  // 4. Verificar DEBUG
  const debug = process.env.EXPO_PUBLIC_DEBUG;
  configs.push({
    variable: 'EXPO_PUBLIC_DEBUG',
    expected: 'true ou false',
    actual: debug,
    status: debug ? 'OK' : 'INVALID',
    message: debug === 'true' 
      ? '✅ Modo debug ativado'
      : '✅ Modo debug desativado',
  });

  // 5. Verificar se está usando HTTP em production
  if (apiUrl && apiUrl.startsWith('http://') && env === 'production') {
    configs.push({
      variable: 'API_URL_PROTOCOL',
      expected: 'https',
      actual: 'http',
      status: 'INVALID',
      message: '❌ CRÍTICO: Usando HTTP em produção! Use HTTPS',
    });
  }

  return configs;
}

export function printConfigStatus(): void {
  console.log('\n' + '='.repeat(60));
  console.log('📋 VERIFICAÇÃO DE CONFIGURAÇÃO - JDE VENDA');
  console.log('='.repeat(60) + '\n');

  const configs = checkApiConfiguration();
  
  let hasErrors = false;
  let hasWarnings = false;

  for (const config of configs) {
    console.log(`${config.variable}:`);
    console.log(`  ${config.message}`);
    
    if (config.status === 'INVALID') hasErrors = true;
    if (config.status === 'MISSING') hasWarnings = true;
    
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('RESUMO:\n');

  const ok = configs.filter(c => c.status === 'OK').length;
  const invalid = configs.filter(c => c.status === 'INVALID').length;
  const missing = configs.filter(c => c.status === 'MISSING').length;

  console.log(`✅ Corretos: ${ok}`);
  console.log(`⚠️  Faltando/Inválidos: ${invalid + missing}`);

  if (hasErrors || hasWarnings) {
    console.log('\n🔧 AÇÕES RECOMENDADAS:');
    
    if (invalid > 0) {
      console.log('\n1. Erros críticos encontrados:');
      configs
        .filter(c => c.status === 'INVALID')
        .forEach(c => console.log(`   - ${c.variable}: ${c.message}`));
    }

    if (missing > 0) {
      console.log('\n2. Variáveis não definidas:');
      configs
        .filter(c => c.status === 'MISSING')
        .forEach(c => console.log(`   - ${c.variable}`));
      
      console.log('\n   Adicione estas variáveis ao arquivo .env');
    }

    console.log('\n3. Passos para correção:');
    console.log('   - Edite o arquivo .env');
    console.log('   - Reinicie o Expo (Ctrl+C e execute "npm start" novamente)');
    console.log('   - Limpe o cache: expo start --clear');
  } else {
    console.log('\n✅ TODAS AS CONFIGURAÇÕES ESTÃO CORRETAS!\n');
  }

  console.log('='.repeat(60) + '\n');
}

// Exportar também como função para uso em componentes
export function isApiConfigured(): boolean {
  const configs = checkApiConfiguration();
  return configs.every(c => c.status === 'OK');
}
