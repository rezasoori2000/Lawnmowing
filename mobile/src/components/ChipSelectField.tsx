import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme';
import { FormLabel } from './FormLabel';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipSelectFieldProps<T extends string> {
  label: string;
  options: ChipOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
}

export function ChipSelectField<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: ChipSelectFieldProps<T>) {
  return (
    <View style={styles.container}>
      <FormLabel label={label} error={error} />
      <View style={styles.wrap}>
        {options.map(option => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button">
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textPrimary },
  chipTextSelected: { color: colors.textInverse, fontFamily: fonts.bold },
});
