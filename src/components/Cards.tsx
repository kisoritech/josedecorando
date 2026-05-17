import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export function Card({
  title,
  value,
  subtitle,
  icon,
  onPress,
  variant = 'default',
}: CardProps) {
  const bgColor = {
    default: 'bg-white',
    success: 'bg-emerald-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50',
  }[variant];

  const textColor = {
    default: 'text-slate-800',
    success: 'text-emerald-700',
    error: 'text-red-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
  }[variant];

  const content = (
    <View className={`${bgColor} rounded-3xl p-6 shadow-sm`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-slate-500 text-sm mb-1">{title}</Text>
          <Text className={`text-3xl font-bold ${textColor}`}>{value}</Text>
          {subtitle && <Text className="text-xs text-slate-500 mt-2">{subtitle}</Text>}
        </View>
        {icon && <Text className="text-4xl">{icon}</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}

interface StatRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatRow({ label, value, icon }: StatRowProps) {
  return (
    <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
      <View className="flex-row items-center gap-3 flex-1">
        {icon && <Text className="text-2xl">{icon}</Text>}
        <Text className="text-slate-700">{label}</Text>
      </View>
      <Text className="font-semibold text-slate-900">{value}</Text>
    </View>
  );
}
