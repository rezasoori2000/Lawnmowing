import { z } from 'zod';

const MOW_HEIGHT_VALUES = [
  '15-20',
  '20-25',
  '25-30',
  '30-35',
  '35-40',
  '40-45',
  '45-50',
  '50-55',
  '55-60',
  '60-65',
  '65+',
] as const;

const FREQUENCY_PRESET_VALUES = ['7-10', '10-14', '14-21', '21-25', 'custom'] as const;

export const lawnAreaSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name is limited to 100 characters.'),
    frequencyPreset: z.enum(FREQUENCY_PRESET_VALUES, {
      errorMap: () => ({ message: 'Please choose a mowing frequency.' }),
    }),
    customFrequencyDays: z
      .number({ invalid_type_error: 'Enter a whole number of days.' })
      .int('Enter a whole number of days.')
      .positive('Must be greater than zero.')
      .optional(),
    defaultMowHeight: z.enum(MOW_HEIGHT_VALUES, {
      errorMap: () => ({ message: 'Please choose a default mow height.' }),
    }),
    notes: z.string().max(2000, 'Notes are limited to 2000 characters.').optional(),
  })
  .refine(
    data => data.frequencyPreset !== 'custom' || typeof data.customFrequencyDays === 'number',
    {
      message: 'Enter the custom number of days.',
      path: ['customFrequencyDays'],
    },
  );

export type LawnAreaFormValues = z.infer<typeof lawnAreaSchema>;
