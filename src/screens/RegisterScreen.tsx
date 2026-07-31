import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { GradientButton } from '../components/GradientButton';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { useResponsiveLayout } from '../utils/responsive';
import { useStyles } from '../utils/responsiveStyles';

export function RegisterScreen({
  fullName,
  email,
  mobileNumber,
  city,
  acceptedTerms,
  onToggleTerms,
  onChangeFullName,
  onChangeEmail,
  onChangeMobile,
  onChangeCity,
  onContinue,
  onLoginPress,
  loading = false,
}: {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  acceptedTerms: boolean;
  onToggleTerms: () => void;
  onChangeFullName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeMobile: (value: string) => void;
  onChangeCity: (value: string) => void;
  onContinue: () => void;
  onLoginPress: () => void;
  loading?: boolean;
}) {
  const layout = useResponsiveLayout();
  const styles = useStyles(RAW_STYLES);
  const canSubmit =
    !loading &&
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    mobileNumber.trim().length >= 10 &&
    city.trim().length > 0 &&
    acceptedTerms;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppBackground variant="auth" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onLoginPress} style={styles.backButton} hitSlop={10}>
          <ArrowLeftIcon size={26} color="#171717" />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join as a vehicle owner and grow your earnings</Text>
        </View>

        <View style={styles.card}>
          <LabeledInput
            label="Full Name"
            value={fullName}
            onChangeText={onChangeFullName}
            placeholder="Enter your full name"
          />
          <LabeledInput
            label="Email Address"
            value={email}
            onChangeText={onChangeEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <LabeledInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={onChangeMobile}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
          <LabeledInput label="City" value={city} onChangeText={onChangeCity} placeholder="City" />

          <Pressable style={styles.termsRow} onPress={onToggleTerms}>
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms ? <CheckIcon size={12} color="#ffffff" /> : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Pressable>
        </View>

        <GradientButton
          label={loading ? 'Saving...' : 'Continue'}
          onPress={onContinue}
          style={styles.button}
          disabled={!canSubmit}
          height={layout.buttonHeight}
          radius={16}
          rightIcon={loading ? undefined : <ArrowRightIcon size={18} color="#ffffff" />}
        />

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={onLoginPress}>
            Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}) {
  const styles = useStyles(RAW_STYLES);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        editable={editable}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const RAW_STYLES = {
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 24,
    lineHeight: 24,
    color: COLORS.textPrimary,
  },
  header: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  field: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 14,
    paddingVertical: 0,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  termsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 13,
  },
  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  termsLink: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  button: {
    marginTop: 24,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 32,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  loginLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
} as const;
