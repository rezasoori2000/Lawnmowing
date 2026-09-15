import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { LogMowScreen } from '../screens/LogMow/LogMowScreen';
import { MowHistoryScreen } from '../screens/History/MowHistoryScreen';
import { ReportsScreen } from '../screens/Reports/ReportsScreen';
import { colors } from '../theme';
import { LawnAreasNavigator } from './LawnAreasNavigator';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Dashboard: '\u{1F3E0}', // house
  LawnAreasTab: '\u{1F33F}', // herb/leaf
  LogMow: '\u{270D}\u{FE0F}', // writing hand
  History: '\u{1F4C5}', // calendar
  Reports: '\u{1F4CA}', // bar chart
};

function TabIcon({ routeName, color }: { routeName: keyof MainTabParamList; color: string }) {
  return <Text style={[styles.icon, { color }]}>{TAB_ICONS[routeName]}</Text>;
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        // eslint-disable-next-line react/no-unstable-nested-components -- this is the
        // shape react-navigation's screenOptions API expects; TabIcon itself is stable.
        tabBarIcon: ({ color }) => <TabIcon routeName={route.name} color={color} />,
      })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="LawnAreasTab"
        component={LawnAreasNavigator}
        options={{ title: 'Lawn Areas' }}
      />
      <Tab.Screen name="LogMow" component={LogMowScreen} options={{ title: 'Log a Mow' }} />
      <Tab.Screen name="History" component={MowHistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 18 },
});
