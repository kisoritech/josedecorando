import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BRAND } from '../constants/theme';
import { useAuth } from '../src/context/AuthContext';
import DashboardScreen from '../src/screens/DashboardScreen';
import LoginScreen from '../src/screens/LoginScreen';
import MovementsScreen from '../src/screens/MovementsScreen';
import OperationsScreen, { OperationMode } from '../src/screens/OperationsScreen';
import ProductsScreen from '../src/screens/ProductsScreen';
import ReportsScreen from '../src/screens/ReportsScreen';

const jdeLogo = require('../assets/images/jde-logo.png');

type RouteKey = 'inicio' | 'venda' | 'locacao' | 'clientes' | 'produtos' | 'movimentos' | 'relatorios';

const routes: {
  key: RouteKey;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  operationMode?: OperationMode;
}[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home' },
  { key: 'venda', label: 'Venda', icon: 'point-of-sale', operationMode: 'venda' },
  { key: 'locacao', label: 'Locacao', icon: 'event-available', operationMode: 'locacao' },
  { key: 'clientes', label: 'Clientes', icon: 'groups', operationMode: 'clientes' },
  { key: 'produtos', label: 'Produtos', icon: 'inventory-2' },
  { key: 'movimentos', label: 'Movimentos', icon: 'sync-alt' },
  { key: 'relatorios', label: 'Relatorios', icon: 'bar-chart' },
];

const mainMenuRoutes = routes.filter((route) =>
  ['inicio', 'venda', 'locacao', 'relatorios'].includes(route.key)
);

export default function IndexRoute() {
  const { user, loading, logout } = useAuth();
  const [activeRoute, setActiveRoute] = React.useState<RouteKey>('inicio');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const active = routes.find((route) => route.key === activeRoute) || routes[0];

  return (
    <SafeAreaView style={styles.shell}>
      <View style={styles.topBar}>
        <View style={styles.brandBlock}>
          <Image source={jdeLogo} resizeMode="contain" style={styles.logo} />
          <Text style={styles.brandText}>JDE</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={22} color="#B91C1C" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {active.key === 'inicio' ? <DashboardScreen onNavigate={setActiveRoute} /> : null}
        {active.operationMode ? (
          <OperationsScreen key={active.key} initialMode={active.operationMode} onNavigate={setActiveRoute} />
        ) : null}
        {active.key === 'produtos' ? <ProductsScreen /> : null}
        {active.key === 'movimentos' ? <MovementsScreen /> : null}
        {active.key === 'relatorios' ? <ReportsScreen /> : null}
      </View>

      <View style={styles.bottomNav}>
        {mainMenuRoutes.map((route) => {
          const selected = activeRoute === route.key;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => setActiveRoute(route.key)}
              style={[styles.navItem, selected && styles.navItemActive]}
            >
              <MaterialIcons name={route.icon} size={22} color={selected ? BRAND.primary : '#64748B'} />
              <Text style={[styles.navLabel, selected && styles.navLabelActive]} numberOfLines={1}>
                {route.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  shell: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
  brandText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  bottomNav: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  navItemActive: {
    backgroundColor: '#EEF2FF',
  },
  navLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  navLabelActive: {
    color: BRAND.primary,
  },
  logoutButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
});
