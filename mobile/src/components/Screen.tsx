import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { colors, spacing } from '../theme';

interface ScreenProps extends ViewProps {
  padded?: boolean;
}

/** Consistent screen-level wrapper: safe area + background + optional padding. */
export function Screen({ style, padded = true, children, ...rest }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, padded && styles.padded, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
});
