import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/formatting';

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-6 py-10">
          {/* Logo */}
          <View className="items-center mb-12 mt-8">
            <View className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-3xl items-center justify-center mb-6 border-2 border-white/30">
              <Text className="text-7xl">🎈</Text>
            </View>
            <Text className="text-white text-4xl font-bold tracking-tight">JDE</Text>
            <Text className="text-white/80 text-base mt-2">José Decorando Encantando</Text>
          </View>

          {/* Form Card */}
          <View className="w-full bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <Text className="text-slate-800 text-2xl font-bold mb-1 text-center">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Text>
            <Text className="text-slate-500 text-sm mb-6 text-center">
              {isLogin ? 'Acesse sua conta JDE' : 'Registre-se para começar'}
            </Text>

            {/* Nome (só em registro) */}
            {!isLogin && (
              <TextInput
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
                placeholderTextColor="#cbd5e1"
                className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-4 text-base"
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
              placeholderTextColor="#cbd5e1"
              className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-4 text-base"
              editable={!loading}
            />

            {/* Senha */}
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#cbd5e1"
              className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 mb-6 text-base"
              editable={!loading}
            />

            {/* Erro */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            )}

            {/* Botão Principal */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-2xl active:opacity-90"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  {isLogin ? 'Entrar' : 'Registrar'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle entre Login e Registro */}
            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-slate-600 text-sm">
                {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
                <Text className="text-indigo-600 font-semibold text-sm">
                  {isLogin ? 'Registre-se' : 'Entre'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-white/70 text-xs mt-8 text-center">
            API: {process.env.EXPO_PUBLIC_API_URL}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
