import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEquipment } from '../../api/equipment';
import { useLawnAreas } from '../../api/lawnAreas';
import { useMowRecords } from '../../api/mowRecords';
import { usePeople } from '../../api/people';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SearchablePickerField } from '../../components/SearchablePickerField';
import { colors, radius, spacing, typography } from '../../theme';
import { MOW_HEIGHT_OPTIONS } from '../../constants/mowOptions';
import { formatDisplayDate } from '../../utils/date';

export function MowHistoryScreen() {
  const { data: records, isLoading } = useMowRecords();
  const { data: lawnAreas } = useLawnAreas();
  const { data: people } = usePeople();
  const { data: equipment } = useEquipment();

  const [lawnAreaId, setLawnAreaId] = useState<string | undefined>(undefined);
  const [personId, setPersonId] = useState<string | undefined>(undefined);
  const [equipmentId, setEquipmentId] = useState<string | undefined>(undefined);
  const [textQuery, setTextQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const lawnAreaNameById = new Map((lawnAreas ?? []).map(a => [a.id, a.name]));
  const personNameById = new Map((people ?? []).map(p => [p.id, p.name]));
  const equipmentNameById = new Map((equipment ?? []).map(e => [e.id, e.name]));
  const mowHeightLabel = (value: string): string =>
    MOW_HEIGHT_OPTIONS.find(o => o.value === value)?.label ?? value;

  const filtered = useMemo(() => {
    const all = records ?? [];
    return all.filter(r => {
      if (lawnAreaId && r.lawnAreaId !== lawnAreaId) {return false;}
      if (personId && r.personId !== personId) {return false;}
      if (equipmentId && r.equipmentId !== equipmentId) {return false;}
      if (dateFrom && r.date < dateFrom) {return false;}
      if (dateTo && r.date > dateTo) {return false;}
      if (textQuery.trim()) {
        const q = textQuery.trim().toLowerCase();
        if (!(r.notes ?? '').toLowerCase().includes(q)) {return false;}
      }
      return true;
    });
  }, [records, lawnAreaId, personId, equipmentId, dateFrom, dateTo, textQuery]);

  return (
    <Screen>
      <Text style={styles.title}>Mowing History</Text>

      <View style={styles.filtersRow}>
        <View style={styles.filterHalf}>
          <SearchablePickerField
            label="Lawn area"
            placeholder="All areas"
            items={(lawnAreas ?? []).map(a => ({ id: a.id, label: a.name }))}
            selectedId={lawnAreaId}
            onSelect={id => setLawnAreaId(id === lawnAreaId ? undefined : id)}
          />
        </View>
        <View style={styles.filterHalf}>
          <SearchablePickerField
            label="Person"
            placeholder="Anyone"
            items={(people ?? []).map(p => ({ id: p.id, label: p.name }))}
            selectedId={personId}
            onSelect={id => setPersonId(id === personId ? undefined : id)}
          />
        </View>
      </View>

      <SearchablePickerField
        label="Equipment / machine"
        placeholder="Any equipment"
        items={(equipment ?? []).map(e => ({ id: e.id, label: e.name }))}
        selectedId={equipmentId}
        onSelect={id => setEquipmentId(id === equipmentId ? undefined : id)}
      />

      <View style={styles.filtersRow}>
        <TextInput
          style={[styles.dateInput, styles.filterHalfInput]}
          placeholder="From (yyyy-MM-dd)"
          placeholderTextColor={colors.textSecondary}
          value={dateFrom}
          onChangeText={setDateFrom}
        />
        <TextInput
          style={[styles.dateInput, styles.filterHalfInput]}
          placeholder="To (yyyy-MM-dd)"
          placeholderTextColor={colors.textSecondary}
          value={dateTo}
          onChangeText={setDateTo}
        />
      </View>

      <TextInput
        style={styles.dateInput}
        placeholder="Search notes..."
        placeholderTextColor={colors.textSecondary}
        value={textQuery}
        onChangeText={setTextQuery}
      />

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          style={styles.list}
          data={filtered}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyState title="No mow records match these filters" />}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Text style={styles.name}>{lawnAreaNameById.get(item.lawnAreaId) ?? 'Unknown'}</Text>
                <Text style={styles.meta}>{formatDisplayDate(item.date)}</Text>
              </View>
              <Text style={styles.meta}>
                {personNameById.get(item.personId) ?? 'Unknown'} ·{' '}
                {equipmentNameById.get(item.equipmentId) ?? 'Unknown'} ·{' '}
                {mowHeightLabel(item.mowHeight)} · {item.direction}
              </Text>
              {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  filtersRow: { flexDirection: 'row', gap: spacing.md },
  filterHalf: { flex: 1 },
  filterHalfInput: { flex: 1, marginBottom: spacing.md },
  dateInput: {
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
  list: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...typography.bodyBold, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  notes: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
});
