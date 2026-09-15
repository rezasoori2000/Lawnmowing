import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLawnArea } from '../../api/lawnAreas';
import { useMowRecordsForLawnArea } from '../../api/mowRecords';
import { useEquipment } from '../../api/equipment';
import { usePeople } from '../../api/people';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { StatusBadge } from '../../components/StatusBadge';
import type { LawnAreasStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { frequencyLabel } from '../../constants/frequencies';
import { MOW_HEIGHT_OPTIONS } from '../../constants/mowOptions';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { getLawnAreaDueInfo } from '../../utils/dueDate';

type Props = NativeStackScreenProps<LawnAreasStackParamList, 'LawnAreaDetail'>;

export function LawnAreaDetailScreen({ route, navigation }: Props) {
  const { lawnAreaId } = route.params;
  const { data: lawnArea, isLoading: isLoadingArea } = useLawnArea(lawnAreaId);
  const { data: records, isLoading: isLoadingRecords } = useMowRecordsForLawnArea(lawnAreaId);
  const { data: people } = usePeople();
  const { data: equipment } = useEquipment();

  const personNameById = new Map((people ?? []).map(p => [p.id, p.name]));
  const equipmentNameById = new Map((equipment ?? []).map(e => [e.id, e.name]));
  const mowHeightLabel = (value: string): string =>
    MOW_HEIGHT_OPTIONS.find(o => o.value === value)?.label ?? value;

  if (isLoadingArea || !lawnArea) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  const dueInfo = getLawnAreaDueInfo(lawnArea, todayIso());

  return (
    <Screen padded={false}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={records ?? []}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{lawnArea.name}</Text>
              <StatusBadge status={dueInfo.status} />
            </View>
            <Card>
              <Row label="Target frequency" value={frequencyLabel(lawnArea.frequency)} />
              <Row label="Default mow height" value={mowHeightLabel(lawnArea.defaultMowHeight)} />
              <Row
                label="Last mowed"
                value={lawnArea.lastMowedDate ? formatDisplayDate(lawnArea.lastMowedDate) : 'Never'}
              />
              {lawnArea.notes ? <Row label="Notes" value={lawnArea.notes} /> : null}
            </Card>
            <PrimaryButton
              title="Log a mow for this area"
              onPress={() =>
                (navigation.getParent() as any)?.navigate('LogMow', { lawnAreaId: lawnArea.id })
              }
              style={styles.logButton}
            />
            <Text style={styles.sectionTitle}>Mow history</Text>
          </View>
        }
        ListEmptyComponent={
          isLoadingRecords ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <EmptyState title="No mow history yet" />
          )
        }
        renderItem={({ item }) => (
          <Card>
            <View style={styles.headerRow}>
              <Text style={styles.recordDate}>{formatDisplayDate(item.date)}</Text>
              <Text style={styles.recordMeta}>{mowHeightLabel(item.mowHeight)}</Text>
            </View>
            <Text style={styles.recordMeta}>
              {personNameById.get(item.personId) ?? 'Unknown'} ·{' '}
              {equipmentNameById.get(item.equipmentId) ?? 'Unknown equipment'} · {item.direction}
            </Text>
            {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
          </Card>
        )}
      />
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: spacing.xxl },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  title: { ...typography.h1, color: colors.textPrimary, flexShrink: 1, marginRight: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.bodyBold, color: colors.textPrimary },
  logButton: { marginTop: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  recordDate: { ...typography.bodyBold, color: colors.textPrimary },
  recordMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  notes: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
});
