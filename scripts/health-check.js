#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const checks = [];

function addCheck(name, passed, message, severity) {
  if (!severity) severity = 'error';
  checks.push({ name: name, passed: passed, message: message, severity: severity });
}

function logResult(check) {
  const icons = { '✅': '✅', '⚠️': '⚠️', '❌': '❌' };
  const icon = check.passed ? '✅' : (check.severity === 'warning' ? '⚠️' : '❌');
  console.log(icon + ' ' + check.name);
  console.log('   ' + check.message);
}

function printHeader() {
  console.log('\n' + '='.repeat(60));
  console.log('🏥 PROJECT HEALTH CHECK - JDE VENDA');
  console.log('='.repeat(60) + '\n');
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO\n');

  const passed = checks.filter(function(c) { return c.passed; }).length;
  const warnings = checks.filter(function(c) { return !c.passed && c.severity === 'warning'; }).length;
  const errors = checks.filter(function(c) { return !c.passed && c.severity === 'error'; }).length;
  const total = checks.length;

  console.log('Total: ' + total);
  console.log('✅ OK: ' + passed);
  console.log('⚠️  Avisos: ' + warnings);
  console.log('❌ Erros: ' + errors);
  console.log('');

  if (errors === 0 && warnings === 0) {
    console.log('🎉 SAUDÁVEL!\n');
    return true;
  } else if (errors === 0) {
    console.log('⚠️  AVISOS ENCONTRADOS\n');
    return true;
  } else {
    console.log('🔴 ERROS ENCONTRADOS\n');
    return false;
  }
}

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  
  addCheck(
    'Arquivo: ' + filePath,
    exists,
    exists ? 'OK' : 'FALTANDO',
    exists ? 'info' : 'error'
  );
  
  return exists;
}

function checkEnvVariable(variable) {
  const value = process.env[variable];
  
  addCheck(
    'Env: ' + variable,
    !!value,
    value ? (variable + '=' + value) : 'NÃO DEFINIDO',
    value ? 'info' : 'warning'
  );
  
  return value;
}

printHeader();

console.log('📁 ARQUIVOS\n');
checkFileExists('.env');
checkFileExists('package.json');
checkFileExists('src/api/api.ts');
checkFileExists('src/context/AuthContext.tsx');

console.log('\n🔧 VARIÁVEIS\n');
const apiUrl = checkEnvVariable('EXPO_PUBLIC_API_URL');
const apiTimeout = checkEnvVariable('EXPO_PUBLIC_API_TIMEOUT');

console.log('\n✔️  CONFIG\n');

if (apiUrl) {
  const isHttps = apiUrl.indexOf('https://') === 0;
  const isRender = apiUrl.indexOf('api-jose-jhbt.onrender.com') >= 0;
  
  addCheck('HTTPS', isHttps || apiUrl.indexOf('localhost') >= 0, 'OK', 'info');
  addCheck('Render', isRender || apiUrl.indexOf('localhost') >= 0, 'OK', 'info');
}

console.log('\n' + '='.repeat(60));
console.log('RESULTADO\n');

for (let i = 0; i < checks.length; i++) {
  logResult(checks[i]);
  console.log('');
}

const healthy = printSummary();

console.log('📚 RECURSOS: QUICK_START.md | TROUBLESHOOTING.md | API_ENDPOINTS.md\n');

process.exit(healthy ? 0 : 1);

