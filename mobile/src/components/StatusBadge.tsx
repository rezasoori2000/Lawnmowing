import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DueStatus } from '../types';
import { colors, radius, spacing, typography } from '../theme';

const STATUS_LABEL: Record<DueStatus, string> = {
  ok: 'On track',
  'due-soon': 'Due soon',
  due: 'Due',
  overdue: 'Overdue',
};

const STATUS_COLORS: Record<DueStatus, { fg: string; bg: string }> = {
  ok: { fg: colors.statusOk, bg: colors.statusOkBg },
  'due-soon': { fg: colors.statusDueSoon, bg: colors.statusDueSoonBg },
  due: { fg: colors.statusDue, bg: colors.statusDueBg },
  overdue: { fg: colors.statusOverdue, bg: colors.statusOverdueBg },
};

export function StatusBadge({ status }: { status: DueStatus }) {
  const palette = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <View style={[styles.dot, { backgroundColor: palette.fg }]} />
      <Text style={[styles.label, { color: palette.fg }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { ...typography.small },
});
