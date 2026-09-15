import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLawnAreasWithLastMowed } from '../../api/lawnAreas';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import type { LawnAreasStackParamList } from '../../navigation/types';
import { colors, radius, spacing, typography } from '../../theme';
import { frequencyLabel } from '../../constants/frequencies';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { getLawnAreaDueInfo } from '../../utils/dueDate';

type Props = NativeStackScreenProps<LawnAreasStackParamList, 'LawnAreasList'>;

export function LawnAreasListScreen({ navigation }: Props) {
  const { data: lawnAreas, isLoading } = useLawnAreasWithLastMowed();
  const [search, setSearch] = useState('');
  const today = todayIso();

  const filtered = useMemo(() => {
    const all = lawnAreas ?? [];
    const q = search.trim().toLowerCase();
    const list = q ? all.filter(a => a.name.toLowerCase().includes(q)) : all;
    return list
      .map(area => getLawnAreaDueInfo(area, today))
      .sort((a, b) => a.lawnArea.name.localeCompare(b.lawnArea.name));
  }, [lawnAreas, search, today]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Lawn Areas</Text>
        <PrimaryButton title="+ Add" onPress={() => navigation.navigate('AddLawnArea')} style={styles.addButton} />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by name..."
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
      />

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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  loading: { marginTop: spacing.xxl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodyBold, color: colors.textPrimary, flexShrink: 1, marginRight: spacing.sm },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
});
