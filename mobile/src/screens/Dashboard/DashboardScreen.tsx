import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLawnAreasWithLastMowed } from '../../api/lawnAreas';
import { useMowRecords } from '../../api/mowRecords';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import { colors, spacing, typography } from '../../theme';
import type { LawnAreaDueInfo, MowRecord } from '../../types';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { getLawnAreaDueInfo, isDueThisWeek, isDueToday, isOverdue, sortByUrgency } from '../../utils/dueDate';

type Section = { title: string; data: LawnAreaDueInfo[] };

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
    { title: `Overdue (${overdue.length})`, data: overdue },
    { title: `Due today (${dueTodayList.length})`, data: dueTodayList },
    { title: `Due this week (${dueThisWeek.length})`, data: dueThisWeek },
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
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <Text style={styles.pageTitle}>Dashboard</Text>
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
                    <Text style={styles.lawnAreaName}>{info.lawnArea.name}</Text>
                    <StatusBadge status={info.status} />
                  </View>
                  <Text style={styles.lawnAreaMeta}>
                    {info.lawnArea.lastMowedDate
                      ? `Last mowed ${formatDisplayDate(info.lawnArea.lastMowedDate)}`
                      : 'Never mowed'}
                  </Text>
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

const styles = StyleSheet.create({
  loading: { marginTop: spacing.xxl },
  listContent: { paddingHorizontal: spacing.lg },
  pageTitle: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionEmpty: { ...typography.caption, color: colors.textSecondary },
  lawnAreaCard: { gap: spacing.xs },
  lawnAreaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lawnAreaName: { ...typography.bodyBold, color: colors.textPrimary },
  lawnAreaMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
