/**
 * TurfOps mobile app entry point.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './src/api/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="light-content" />
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
