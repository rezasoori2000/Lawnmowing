import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateLawnArea } from '../../api/lawnAreas';
import { ChipSelectField } from '../../components/ChipSelectField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { FREQUENCY_OPTIONS, buildFrequency } from '../../constants/frequencies';
import { MOW_HEIGHT_OPTIONS } from '../../constants/mowOptions';
import type { LawnAreasStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { lawnAreaSchema, type LawnAreaFormValues } from '../../validation/lawnAreaSchema';

type Props = NativeStackScreenProps<LawnAreasStackParamList, 'AddLawnArea'>;

export function AddLawnAreaScreen({ navigation }: Props) {
  const createLawnArea = useCreateLawnArea();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LawnAreaFormValues>({
    resolver: zodResolver(lawnAreaSchema),
    defaultValues: {
      name: '',
      frequencyPreset: '10-14',
      defaultMowHeight: '30-35',
      notes: '',
    },
  });

  const frequencyPreset = watch('frequencyPreset');

  async function onSubmit(values: LawnAreaFormValues) {
    await createLawnArea.mutateAsync({
      name: values.name,
      frequency: buildFrequency(values.frequencyPreset, values.customFrequencyDays),
      defaultMowHeight: values.defaultMowHeight,
      notes: values.notes || undefined,
    });
    navigation.goBack();
  }

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Lawn Area</Text>

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              label="Name"
              placeholder="e.g. Deer shed"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="frequencyPreset"
          render={({ field }) => (
            <ChipSelectField
              label="Target mow frequency"
              options={FREQUENCY_OPTIONS.map(o => ({ value: o.preset, label: o.label }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.frequencyPreset?.message}
            />
          )}
        />

        {frequencyPreset === 'custom' ? (
          <Controller
            control={control}
            name="customFrequencyDays"
            render={({ field }) => (
              <TextField
                label="Custom frequency (days)"
                placeholder="e.g. 18"
                keyboardType="number-pad"
                value={field.value ? String(field.value) : ''}
                onChangeText={text => field.onChange(text ? Number(text) : undefined)}
                error={errors.customFrequencyDays?.message}
              />
            )}
          />
        ) : null}

        <Controller
          control={control}
          name="defaultMowHeight"
          render={({ field }) => (
            <ChipSelectField
              label="Default mow height"
              options={MOW_HEIGHT_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.defaultMowHeight?.message}
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

        <PrimaryButton
          title="Save lawn area"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.lg },
});
