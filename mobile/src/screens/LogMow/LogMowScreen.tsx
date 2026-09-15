import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCreateEquipment, useEquipment } from '../../api/equipment';
import { useLawnAreas } from '../../api/lawnAreas';
import { useCreateMowRecord } from '../../api/mowRecords';
import { useCreatePerson, usePeople } from '../../api/people';
import { ChipSelectField } from '../../components/ChipSelectField';
import { FormLabel } from '../../components/FormLabel';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SearchablePickerField } from '../../components/SearchablePickerField';
import { TextField } from '../../components/TextField';
import { MOW_DIRECTION_OPTIONS, MOW_HEIGHT_OPTIONS } from '../../constants/mowOptions';
import type { MainTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing, typography } from '../../theme';
import { formatDisplayDate, todayIso } from '../../utils/date';
import { mowRecordSchema, type MowRecordFormValues } from '../../validation/mowRecordSchema';

type Props = BottomTabScreenProps<MainTabParamList, 'LogMow'>;

export function LogMowScreen({ route, navigation }: Props) {
  const currentUser = useAuthStore(state => state.user);
  const { data: lawnAreas } = useLawnAreas();
  const { data: people } = usePeople();
  const { data: equipment } = useEquipment();
  const createPerson = useCreatePerson();
  const createEquipment = useCreateEquipment();
  const createMowRecord = useCreateMowRecord();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MowRecordFormValues>({
    resolver: zodResolver(mowRecordSchema),
    defaultValues: {
      lawnAreaId: route.params?.lawnAreaId ?? '',
      date: todayIso(),
      mowHeight: '30-35',
      direction: 'N',
      personId: '',
      equipmentId: '',
      notes: '',
      photoUri: undefined,
    },
  });

  async function onSubmit(values: MowRecordFormValues) {
    setSubmitError(null);
    try {
      await createMowRecord.mutateAsync({
        lawnAreaId: values.lawnAreaId,
        date: values.date,
        mowHeight: values.mowHeight,
        direction: values.direction,
        personId: values.personId,
        equipmentId: values.equipmentId,
        notes: values.notes || undefined,
        photoUri: values.photoUri,
        loggedByUserId: currentUser?.id,
      });
      reset({
        lawnAreaId: '',
        date: todayIso(),
        mowHeight: '30-35',
        direction: 'N',
        personId: '',
        equipmentId: '',
        notes: '',
        photoUri: undefined,
      });
      Alert.alert('Saved', 'Mow record saved.');
      navigation.navigate('Dashboard');
    } catch {
      setSubmitError('Could not save the mow record. Please try again.');
    }
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Log a Mow</Text>

        <Controller
          control={control}
          name="lawnAreaId"
          render={({ field }) => (
            <SearchablePickerField
              label="Lawn area"
              placeholder="Select a lawn area"
              items={(lawnAreas ?? []).map(a => ({ id: a.id, label: a.name }))}
              selectedId={field.value}
              onSelect={field.onChange}
              error={errors.lawnAreaId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <View style={styles.dateField}>
              <FormLabel label="Date" error={errors.date?.message} />
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{formatDisplayDate(field.value)}</Text>
              </TouchableOpacity>
              {showDatePicker ? (
                <DateTimePicker
                  value={new Date(field.value)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  maximumDate={new Date()}
                  onChange={(_event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      field.onChange(
                        `${selectedDate.getFullYear()}-${String(
                          selectedDate.getMonth() + 1,
                        ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
                      );
                    }
                  }}
                />
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="mowHeight"
          render={({ field }) => (
            <ChipSelectField
              label="Mow length / height"
              options={MOW_HEIGHT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.mowHeight?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="direction"
          render={({ field }) => (
            <ChipSelectField
              label="Mowing direction"
              options={MOW_DIRECTION_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.direction?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="personId"
          render={({ field }) => (
            <SearchablePickerField
              label="Mowed by"
              placeholder="Select a person"
              items={(people ?? []).map(p => ({ id: p.id, label: p.name }))}
              selectedId={field.value}
              onSelect={field.onChange}
              error={errors.personId?.message}
              addNewLabel="Add person"
              onAddNew={async name => {
                const created = await createPerson.mutateAsync(name);
                return { id: created.id, label: created.name };
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="equipmentId"
          render={({ field }) => (
            <SearchablePickerField
              label="Equipment used"
              placeholder="Select equipment"
              items={(equipment ?? []).map(e => ({ id: e.id, label: e.name }))}
              selectedId={field.value}
              onSelect={field.onChange}
              error={errors.equipmentId?.message}
              addNewLabel="Add equipment"
              onAddNew={async name => {
                const created = await createEquipment.mutateAsync(name);
                return { id: created.id, label: created.name };
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField
              label="Notes"
              placeholder="Optional notes"
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={3}
              error={errors.notes?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="photoUri"
          render={({ field }) => (
            <View style={styles.photoField}>
              <FormLabel label="Photo (optional)" />
              {field.value ? (
                <Image source={{ uri: field.value }} style={styles.photoPreview} />
              ) : null}
              <View style={styles.photoButtons}>
                <PrimaryButton
                  title="Take photo"
                  variant="secondary"
                  style={styles.photoButton}
                  onPress={async () => {
                    const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
                    const uri = result.assets?.[0]?.uri;
                    if (uri) {field.onChange(uri);}
                  }}
                />
                <PrimaryButton
                  title="Choose from gallery"
                  variant="secondary"
                  style={styles.photoButton}
                  onPress={async () => {
                    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
                    const uri = result.assets?.[0]?.uri;
                    if (uri) {field.onChange(uri);}
                  }}
                />
              </View>
            </View>
          )}
        />

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

        <PrimaryButton title="Save" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        <View style={styles.footerSpacer} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.lg },
  dateField: { marginBottom: spacing.lg },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  dateText: { ...typography.body, color: colors.textPrimary },
  photoField: { marginBottom: spacing.lg },
  photoPreview: { width: '100%', height: 180, borderRadius: radius.md, marginBottom: spacing.sm },
  photoButtons: { flexDirection: 'row', gap: spacing.sm },
  photoButton: { flex: 1 },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  footerSpacer: { height: spacing.xxl },
});
