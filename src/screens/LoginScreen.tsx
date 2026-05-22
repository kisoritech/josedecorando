import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BRAND } from '../../constants/theme';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/formatting';

const jdeLogo = require('../../assets/images/jde-logo.png');

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, error, clearError } = useAuth();
  const emailInputRef = useRef(null);

  const handleSubmit = async () => {
    clearError();

    // Validações básicas
    if (!email.trim()) {
      Alert.alert('Erro', 'Email é obrigatório');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Erro', 'Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!isLogin && !nome.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        Alert.alert('Sucesso', 'Bem-vindo ao JDE!');
      } else {
        await register(nome, email, password, 'vendedor');
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Operação falhou';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[BRAND.primary, BRAND.secondary, BRAND.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingVertical: 40,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 28, marginTop: 18 }}>
              <Image
                source={jdeLogo}
                resizeMode="contain"
                style={{
                  width: 210,
                  height: 210,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                }}
              />
            </View>

            {/* Form Card */}
            <View
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 24,
                padding: 32,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Text
                style={{
                  color: '#1F2937',
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginBottom: 4,
                  textAlign: 'center',
                }}
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 14,
                  marginBottom: 24,
                  textAlign: 'center',
                }}
              >
                {isLogin ? 'Acesse sua conta JDE' : 'Registre-se para começar'}
              </Text>

              {/* Nome (só em registro) */}
              {!isLogin && (
                <TextInput
                  placeholder="Nome Completo"
                  value={nome}
                  onChangeText={setNome}
                  placeholderTextColor="#CBD5E1"
                  style={{
                    backgroundColor: '#F3F4F6',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 16,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    marginBottom: 16,
                    fontSize: 16,
                    color: '#1F2937',
                  }}
                  editable={!loading}
                />
              )}

              {/* Email */}
              <TextInput
                ref={emailInputRef}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#CBD5E1"
                style={{
                  backgroundColor: '#F3F4F6',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  marginBottom: 16,
                  fontSize: 16,
                  color: '#1F2937',
                }}
                editable={!loading}
              />

              {/* Senha */}
              <TextInput
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#CBD5E1"
                style={{
                  backgroundColor: '#F3F4F6',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  marginBottom: 24,
                  fontSize: 16,
                  color: '#1F2937',
                }}
                editable={!loading}
              />

              {/* Erro */}
              {error && (
                <View
                  style={{
                    backgroundColor: '#FEE2E2',
                    borderWidth: 1,
                    borderColor: '#FECACA',
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <Text style={{ color: '#991B1B', fontSize: 14 }}>{error}</Text>
                </View>
              )}

              {/* Botão Principal */}
              <LinearGradient
                colors={[BRAND.primary, BRAND.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, marginBottom: 16 }}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={{ paddingVertical: 16 }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                    >
                      {isLogin ? 'Entrar' : 'Registrar'}
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>

              {/* Toggle entre Login e Registro */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 24,
                }}
              >
                <Text style={{ color: '#6B7280', fontSize: 14 }}>
                  {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
                  <Text style={{ color: BRAND.primary, fontWeight: '600', fontSize: 14 }}>
                    {isLogin ? 'Registre-se' : 'Entre'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
