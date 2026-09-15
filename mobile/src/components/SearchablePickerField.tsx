import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { FormLabel } from './FormLabel';
import { PrimaryButton } from './PrimaryButton';

export interface PickerItem {
  id: string;
  label: string;
}

interface SearchablePickerFieldProps {
  label: string;
  placeholder?: string;
  items: PickerItem[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  error?: string;
  /** When provided, shows an "Add new" affordance that creates an item on the fly. */
  onAddNew?: (name: string) => Promise<PickerItem> | PickerItem;
  addNewLabel?: string;
}

/**
 * A tappable field that opens a modal with a searchable list, used for the
 * lawn area / person / equipment pickers on the Log a Mow and Add Lawn Area
 * forms. Optionally supports adding a brand-new item inline (e.g. "Add
 * person", "Add equipment") per the product spec.
 */
export function SearchablePickerField({
  label,
  placeholder = 'Select...',
  items,
  selectedId,
  onSelect,
  error,
  onAddNew,
  addNewLabel = 'Add new',
}: SearchablePickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedLabel = items.find(i => i.id === selectedId)?.label;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {return items;}
    return items.filter(i => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const exactMatchExists = items.some(i => i.label.toLowerCase() === query.trim().toLowerCase());

  async function handleAddNew() {
    if (!onAddNew || !query.trim() || submitting) {return;}
    setSubmitting(true);
    try {
      const created = await onAddNew(query.trim());
      onSelect(created.id);
      setVisible(false);
      setQuery('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <FormLabel label={label} error={error} />
      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => setVisible(true)}
        accessibilityRole="button">
        <Text style={selectedLabel ? styles.valueText : styles.placeholderText}>
          {selectedLabel ?? placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{label}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelect(item.id);
                  setVisible(false);
                  setQuery('');
                }}>
                <Text style={styles.rowText}>{item.label}</Text>
                {item.id === selectedId ? <Text style={styles.checkmark}>✓</Text> : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matches{onAddNew ? ' - add one below' : ''}.</Text>
            }
          />
          {onAddNew && query.trim().length > 0 && !exactMatchExists ? (
            <View style={styles.addNewContainer}>
              <PrimaryButton
                title={`${addNewLabel}: "${query.trim()}"`}
                onPress={handleAddNew}
                loading={submitting}
              />
            </View>
          ) : null}
          <PrimaryButton
            title="Close"
            variant="secondary"
            onPress={() => {
              setVisible(false);
              setQuery('');
            }}
            style={styles.closeButton}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.danger },
  valueText: { ...typography.body, color: colors.textPrimary },
  placeholderText: { ...typography.body, color: colors.textSecondary },
  modalContainer: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: spacing.xl },
  modalTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: { ...typography.body, color: colors.textPrimary },
  checkmark: { ...typography.bodyBold, color: colors.primary },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  addNewContainer: { marginTop: spacing.md },
  closeButton: { marginTop: spacing.md },
});
