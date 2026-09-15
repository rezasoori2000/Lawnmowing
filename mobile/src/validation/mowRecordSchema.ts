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

const MOW_DIRECTION_VALUES = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const mowRecordSchema = z.object({
  lawnAreaId: z.string().min(1, 'Please choose a lawn area.'),
  date: z
    .string()
    .regex(isoDatePattern, 'Date must be a valid yyyy-MM-dd value.')
    .refine(value => !Number.isNaN(new Date(value).getTime()), 'Date is invalid.'),
  mowHeight: z.enum(MOW_HEIGHT_VALUES, {
    errorMap: () => ({ message: 'Please choose a mow height.' }),
  }),
  direction: z.enum(MOW_DIRECTION_VALUES, {
    errorMap: () => ({ message: 'Please choose a mowing direction.' }),
  }),
  personId: z.string().min(1, 'Please choose who mowed.'),
  equipmentId: z.string().min(1, 'Please choose the equipment used.'),
  notes: z.string().max(2000, 'Notes are limited to 2000 characters.').optional(),
  photoUri: z.string().optional(),
});

export type MowRecordFormValues = z.infer<typeof mowRecordSchema>;
