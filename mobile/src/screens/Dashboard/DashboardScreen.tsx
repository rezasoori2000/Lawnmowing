import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLawnAreasWithLastMowed } from '../../api/lawnAreas';
import { useMowRecords } from '../../api/mowRecords';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import { ClockIcon, DueTodayIcon } from '../../components/icons';
import { colors, radius, spacing, typography } from '../../theme';
import type { LawnAreaDueInfo, MowRecord } from '../../types';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { getLawnAreaDueInfo, isDueThisWeek, isDueToday, isOverdue, sortByUrgency } from '../../utils/dueDate';

type Section = { title: string; data: LawnAreaDueInfo[]; icon: 'overdue' | 'due' };

export function DashboardScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const lawnAreasQuery = useLawnAreasWithLastMowed();
  const mowRecordsQuery = useMowRecords();
  const today = todayIso();

  const dueInfos = useMemo(
    () => (lawnAreasQuery.data ?? []).map(area => getLawnAreaDueInfo(area, today)),
    [lawnAreasQuery.data, today],
  );

  const overdue = useMemo(() => sortByUrgency(dueInfos.filter(isOverdue)), [dueInfos]);
  const dueTodayList = useMemo(() => sortByUrgency(dueInfos.filter(isDueToday)), [dueInfos]);
  const dueThisWeek = useMemo(
    () => sortByUrgency(dueInfos.filter(i => isDueThisWeek(i) && !isDueToday(i))),
    [dueInfos],
  );

  const recentlyMowed = useMemo(() => {
    const records: MowRecord[] = mowRecordsQuery.data ?? [];
    return [...records].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  }, [mowRecordsQuery.data]);

  const lawnAreaNameById = useMemo(
    () => new Map((lawnAreasQuery.data ?? []).map(a => [a.id, a.name])),
    [lawnAreasQuery.data],
  );

  const isLoading = lawnAreasQuery.isLoading || mowRecordsQuery.isLoading;
  const isRefreshing = lawnAreasQuery.isFetching || mowRecordsQuery.isFetching;

  function refresh() {
    lawnAreasQuery.refetch();
    mowRecordsQuery.refetch();
  }

  const sections: Section[] = [
    { title: 'Overdue', data: overdue, icon: 'overdue' },
    { title: 'Due today', data: dueTodayList, icon: 'due' },
    { title: 'Due this week', data: dueThisWeek, icon: 'due' },
  ];

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator style={styles.loading} color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + spacing.xl }]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.textPrimary} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>TurfOps</Text>
            <Text style={styles.pageTitle}>Run sheet</Text>
            <View style={styles.statRow}>
              <StatTile value={overdue.length} label="Overdue" tone="overdue" />
              <StatTile value={dueTodayList.length} label="Due today" tone="neutral" />
              <StatTile value={dueThisWeek.length} label="This week" tone="ok" />
            </View>
          </View>
        }
        data={sections}
        keyExtractor={item => item.title}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.length === 0 ? (
              <Text style={styles.sectionEmpty}>Nothing here right now.</Text>
            ) : (
              section.data.map(info => (
                <Card key={info.lawnArea.id} style={styles.lawnAreaCard}>
                  <View style={styles.lawnAreaRow}>
                    <View
                      style={[
                        styles.iconChip,
                        section.icon === 'due' && styles.iconChipNeutral,
                      ]}>
                      {section.icon === 'overdue' ? (
                        <ClockIcon color={colors.primaryLight} size={20} />
                      ) : (
                        <DueTodayIcon color={colors.accent} size={20} />
                      )}
                    </View>
                    <View style={styles.lawnAreaInfo}>
                      <Text style={styles.lawnAreaName}>{info.lawnArea.name}</Text>
                      <Text style={styles.lawnAreaMeta}>
                        {info.lawnArea.lastMowedDate
                          ? `Last mowed ${formatDisplayDate(info.lawnArea.lastMowedDate)}`
                          : 'Never mowed'}
                      </Text>
                    </View>
                    <StatusBadge status={info.status} />
                  </View>
                </Card>
              ))
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently mowed</Text>
            {recentlyMowed.length === 0 ? (
              <EmptyState title="No mows logged yet" subtitle="Log a mow to see it appear here." />
            ) : (
              recentlyMowed.map(record => (
                <Card key={record.id}>
                  <Text style={styles.lawnAreaName}>
                    {lawnAreaNameById.get(record.lawnAreaId) ?? 'Unknown area'}
                  </Text>
                  <Text style={styles.lawnAreaMeta}>{formatDisplayDate(record.date)}</Text>
                </Card>
              ))
            )}
          </View>
        }
      />
    </Screen>
  );
}

function StatTile({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'overdue' | 'neutral' | 'ok';
}) {
  return (
    <View
      style={[
        styles.statTile,
        tone === 'overdue' && styles.statTileOverdue,
        tone === 'ok' && styles.statTileOk,
      ]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: spacing.xxl },
  listContent: { paddingHorizontal: spacing.lg },
  header: { marginTop: spacing.lg, marginBottom: spacing.lg },
  eyebrow: {
    ...typography.small,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  pageTitle: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg },
  statRow: { flexDirection: 'row', gap: spacing.sm },
  statTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statTileOverdue: { backgroundColor: colors.statusOverdueBg, borderColor: 'transparent' },
  statTileOk: { backgroundColor: colors.statusOkBg, borderColor: 'transparent' },
  statValue: { ...typography.h2, color: colors.textPrimary },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionEmpty: { ...typography.caption, color: colors.textSecondary },
  lawnAreaCard: { gap: spacing.xs },
  lawnAreaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.statusOverdueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipNeutral: { backgroundColor: colors.statusDueBg },
  lawnAreaInfo: { flex: 1, minWidth: 0 },
  lawnAreaName: { ...typography.bodyBold, color: colors.textPrimary },
  lawnAreaMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
