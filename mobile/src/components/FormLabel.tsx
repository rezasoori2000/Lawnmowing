import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function FormLabel({ label, error }: { label: string; error?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  label: { ...typography.bodyBold, color: colors.textPrimary },
  error: { ...typography.caption, color: colors.danger },
});
