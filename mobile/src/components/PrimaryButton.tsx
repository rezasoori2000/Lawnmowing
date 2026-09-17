import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  style,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.85}
      style={[
        styles.button,
        isSecondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.textPrimary : colors.textInverse} />
      ) : (
        <Text style={[styles.label, isSecondary && styles.secondaryLabel]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.6 },
  label: { ...typography.bodyBold, color: colors.textInverse },
  secondaryLabel: { color: colors.textPrimary },
});
