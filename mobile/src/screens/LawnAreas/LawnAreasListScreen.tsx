import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLawnAreasWithLastMowed } from '../../api/lawnAreas';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import { SearchIcon } from '../../components/icons';
import type { LawnAreasStackParamList } from '../../navigation/types';
import type { DueStatus } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';
import { frequencyLabel } from '../../constants/frequencies';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { getLawnAreaDueInfo } from '../../utils/dueDate';

type Props = NativeStackScreenProps<LawnAreasStackParamList, 'LawnAreasList'>;

type Filter = 'all' | DueStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'due', label: 'Due' },
  { value: 'ok', label: 'On track' },
];

export function LawnAreasListScreen({ navigation }: Props) {
  const { data: lawnAreas, isLoading } = useLawnAreasWithLastMowed();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const today = todayIso();

  const filtered = useMemo(() => {
    const all = lawnAreas ?? [];
    const q = search.trim().toLowerCase();
    const list = q ? all.filter(a => a.name.toLowerCase().includes(q)) : all;
    return list
      .map(area => getLawnAreaDueInfo(area, today))
      .filter(info => filter === 'all' || info.status === filter)
      .sort((a, b) => a.lawnArea.name.localeCompare(b.lawnArea.name));
  }, [lawnAreas, search, today, filter]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Lawn areas</Text>
        <PrimaryButton title="+ Add" onPress={() => navigation.navigate('AddLawnArea')} style={styles.addButton} />
      </View>

      <View style={styles.search}>
        <SearchIcon color={colors.textSecondary} size={17} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search areas"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const selected = f.value === filter;
          return (
            <TouchableOpacity
              key={f.value}
              onPress={() => setFilter(f.value)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}>
              <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.lawnArea.id}
          ListEmptyComponent={
            <EmptyState title="No lawn areas found" subtitle="Try a different search or add a new area." />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LawnAreaDetail', { lawnAreaId: item.lawnArea.id })
              }>
              <Card>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.lawnArea.name}</Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text style={styles.meta}>
                  {frequencyLabel(item.lawnArea.frequency)} ·{' '}
                  {item.lawnArea.lastMowedDate
                    ? `Last mowed ${formatDisplayDate(item.lawnArea.lastMowedDate)}`
                    : 'Never mowed'}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary },
  addButton: { paddingHorizontal: spacing.lg, minHeight: 40 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary, padding: 0 },
  filterRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    backgroundColor: colors.surface,
  },
  filterChipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterChipText: { ...typography.small, color: colors.textSecondary },
  filterChipTextSelected: { color: colors.background },
  loading: { marginTop: spacing.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodyBold, color: colors.textPrimary, flexShrink: 1, marginRight: spacing.sm },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
