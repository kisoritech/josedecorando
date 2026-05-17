import React from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          <Text className="text-2xl font-bold mb-2">{title}</Text>
          <Text className="text-slate-600 mb-6">{message}</Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="flex-1 py-3 border border-slate-300 rounded-2xl"
            >
              <Text className="text-center font-semibold text-slate-700">{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className={`flex-1 py-3 rounded-2xl ${
                isDangerous ? 'bg-red-600' : 'bg-indigo-600'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-semibold text-white">{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export function LoadingModal({ visible, message = 'Carregando...' }: LoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white rounded-3xl p-8 items-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="mt-4 text-slate-600 font-medium">{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
  type?: 'success' | 'error' | 'info';
}

export function AlertModal({ visible, title, message, onDismiss, type = 'info' }: AlertModalProps) {
  const bgColor = {
    success: 'bg-emerald-50',
    error: 'bg-red-50',
    info: 'bg-blue-50',
  }[type];

  const borderColor = {
    success: 'border-emerald-200',
    error: 'border-red-200',
    info: 'border-blue-200',
  }[type];

  const titleColor = {
    success: 'text-emerald-900',
    error: 'text-red-900',
    info: 'text-blue-900',
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }[type];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className={`${bgColor} border-2 ${borderColor} rounded-3xl p-6 w-full max-w-sm`}>
          <View className="flex-row items-center gap-4 mb-4">
            <Text className="text-3xl">{icon}</Text>
            <Text className={`text-xl font-bold flex-1 ${titleColor}`}>{title}</Text>
          </View>
          <Text className="text-slate-700 mb-6">{message}</Text>

          <TouchableOpacity onPress={onDismiss} className="bg-indigo-600 py-3 rounded-2xl">
            <Text className="text-center font-semibold text-white">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
