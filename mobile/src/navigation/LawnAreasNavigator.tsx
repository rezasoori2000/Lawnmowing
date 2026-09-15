import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddLawnAreaScreen } from '../screens/LawnAreas/AddLawnAreaScreen';
import { LawnAreaDetailScreen } from '../screens/LawnAreas/LawnAreaDetailScreen';
import { LawnAreasListScreen } from '../screens/LawnAreas/LawnAreasListScreen';
import { colors } from '../theme';
import type { LawnAreasStackParamList } from './types';

const Stack = createNativeStackNavigator<LawnAreasStackParamList>();

export function LawnAreasNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primaryDark,
        headerStyle: { backgroundColor: colors.surface },
      }}>
      <Stack.Screen
        name="LawnAreasList"
        component={LawnAreasListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LawnAreaDetail"
        component={LawnAreaDetailScreen}
        options={{ title: 'Lawn Area' }}
      />
      <Stack.Screen
        name="AddLawnArea"
        component={AddLawnAreaScreen}
        options={{ title: 'Add Lawn Area' }}
      />
    </Stack.Navigator>
  );
}
