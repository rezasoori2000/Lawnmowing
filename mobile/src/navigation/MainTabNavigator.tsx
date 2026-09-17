import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { LogMowScreen } from '../screens/LogMow/LogMowScreen';
import { MowHistoryScreen } from '../screens/History/MowHistoryScreen';
import { ReportsScreen } from '../screens/Reports/ReportsScreen';
import { AreasIcon, HistoryIcon, HomeIcon, PlusIcon, ReportsIcon } from '../components/icons';
import { colors, radius } from '../theme';
import { LawnAreasNavigator } from './LawnAreasNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, React.ComponentType<{ color: string; size?: number }>> = {
  Dashboard: HomeIcon,
  LawnAreasTab: AreasIcon,
  LogMow: PlusIcon,
  History: HistoryIcon,
  Reports: ReportsIcon,
};

function TabIcon({ routeName, color }: { routeName: keyof MainTabParamList; color: string }) {
  const Icon = TAB_ICONS[routeName];
  return <Icon color={color} size={22} />;
}

function CenterTabButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.centerButtonWrap}>
      <View style={styles.centerButton}>
        <PlusIcon color={colors.textInverse} size={26} />
      </View>
    </TouchableOpacity>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        // eslint-disable-next-line react/no-unstable-nested-components -- shape react-navigation's screenOptions API expects; TabIcon itself is stable.
        tabBarIcon: ({ color }) => <TabIcon routeName={route.name} color={color} />,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="LawnAreasTab"
        component={LawnAreasNavigator}
        options={{ title: 'Lawn Areas' }}
      />
      <Tab.Screen
        name="LogMow"
        component={LogMowScreen}
        options={{
          title: 'Log a Mow',
          tabBarShowLabel: false,
          tabBarIcon: () => null,
          // eslint-disable-next-line react/no-unstable-nested-components -- required by react-navigation's screenOptions API; the button itself is stable.
          tabBarButton: buttonProps => <CenterTabButton onPress={buttonProps.onPress as () => void} />,
        }}
      />
      <Tab.Screen name="History" component={MowHistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(18, 26, 12, 0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    height: 88,
    paddingTop: 10,
  },
  tabLabel: { fontSize: 10, fontWeight: '600' },
  centerButtonWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
});
