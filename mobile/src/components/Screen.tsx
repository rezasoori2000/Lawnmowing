import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { GradientBackground } from './GradientBackground';
import { spacing } from '../theme';

interface ScreenProps extends ViewProps {
  padded?: boolean;
}

/** Consistent screen-level wrapper: dark gradient background + safe area + optional padding. */
export function Screen({ style, padded = true, children, ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientBackground />
      <View style={[styles.container, padded && styles.padded, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1d2414' },
  container: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
});
