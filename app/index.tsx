import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BRAND } from '../constants/theme';
import { useAuth } from '../src/context/AuthContext';
import DashboardScreen from '../src/screens/DashboardScreen';
import LoginScreen from '../src/screens/LoginScreen';
import MovementsScreen from '../src/screens/MovementsScreen';
import ProductsScreen from '../src/screens/ProductsScreen';
import ReportsScreen from '../src/screens/ReportsScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Produtos',
          tabBarLabel: 'Produtos',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory-2" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Movements"
        component={MovementsScreen}
        options={{
          title: 'Movimentacoes',
          tabBarLabel: 'Movimentos',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="sync-alt" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Relatorios',
          tabBarLabel: 'Relatorios',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="bar-chart" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function IndexRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return user ? <TabNavigator /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
