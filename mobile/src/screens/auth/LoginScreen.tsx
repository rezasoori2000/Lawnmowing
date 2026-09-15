import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { login } from '../../api/auth';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const signIn = useAuthStore(state => state.signIn);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    try {
      const { token, user } = await login(values.email, values.password);
      await signIn(token, user);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Sign in failed. Please try again.');
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>TurfOps</Text>
        <Text style={styles.subtitle}>Sign in to log and track mowing</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label="Email"
            placeholder="you@farm.co.nz"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextField
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={errors.password?.message}
          />
        )}
      />

      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

      <PrimaryButton title="Sign in" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />

      <Text style={styles.hint}>
        No API connected yet? Any email/password will sign you in locally for development.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.xxl, marginBottom: spacing.xl },
  title: { ...typography.h1, color: colors.primaryDark },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.md },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
