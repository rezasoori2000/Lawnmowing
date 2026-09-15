import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMowReports } from '../../api/reports';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { colors, radius, spacing, typography } from '../../theme';
import { addDays, todayIso } from '../../utils/date';
import type { CountByKey } from '../../types';

/**
 * Phase 1 reports: simple aggregate lists (mows per lawn area / per person /
 * per machine) over a selectable date range. Deliberately no charting
 * library yet - `CountByKey[]` is a shape a bar/pie chart could consume
 * directly later (see src/api/reports.ts).
 */
export function ReportsScreen() {
  const [from, setFrom] = useState(addDays(todayIso(), -30));
  const [to, setTo] = useState(todayIso());
  const { mowsPerLawnArea, mowsPerPerson, mowsPerEquipment, totalMows, isLoading } = useMowReports({
    from,
    to,
  });

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reports</Text>

        <View style={styles.dateRow}>
          <TextInput
            style={[styles.dateInput, styles.dateHalf]}
            value={from}
            onChangeText={setFrom}
            placeholder="From (yyyy-MM-dd)"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[styles.dateInput, styles.dateHalf]}
            value={to}
            onChangeText={setTo}
            placeholder="To (yyyy-MM-dd)"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : (
          <>
            <Card>
              <Text style={styles.totalLabel}>Total mows in range</Text>
              <Text style={styles.totalValue}>{totalMows}</Text>
            </Card>

            <ReportSection title="Mows per lawn area" rows={mowsPerLawnArea} />
            <ReportSection title="Mows per person" rows={mowsPerPerson} />
            <ReportSection title="Mows per machine" rows={mowsPerEquipment} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function ReportSection({ title, rows }: { title: string; rows: CountByKey[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {rows.length === 0 ? (
        <EmptyState title="No data in this range" />
      ) : (
        <Card>
          {rows.map((row, index) => (
            <View
              key={row.key}
              style={[styles.reportRow, index === rows.length - 1 && styles.reportRowLast]}>
              <Text style={styles.reportLabel}>{row.label}</Text>
              <Text style={styles.reportCount}>{row.count}</Text>
            </View>
          ))}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  dateRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  dateHalf: { flex: 1 },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  loading: { marginTop: spacing.xxl },
  totalLabel: { ...typography.caption, color: colors.textSecondary },
  totalValue: { ...typography.h1, color: colors.primaryDark, marginTop: spacing.xs },
  section: { marginTop: spacing.lg, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reportRowLast: { borderBottomWidth: 0 },
  reportLabel: { ...typography.body, color: colors.textPrimary },
  reportCount: { ...typography.bodyBold, color: colors.primaryDark },
});
