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
import { FONTS } from '../constants/fonts';
import { useScreenInsets } from '../utils/insets';
import { useStyles } from '../utils/responsiveStyles';

// Figma 475-13506 / 475-13773 "Create Account": plain back arrow, 30px bold
// heading, 16px lead, one frosted card holding the four fields + the terms
// row, then the gradient Continue button and the login link.
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
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.headerTop - 12, paddingBottom: 32 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onLoginPress} style={styles.backButton} hitSlop={12}>
          <ArrowLeftIcon size={24} color="#1e293b" />
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
              {acceptedTerms ? <CheckIcon size={11} color="#ffffff" /> : null}
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
          height={48}
          radius={16}
          rightIcon={loading ? undefined : <ArrowRightIcon size={16} color="#ffffff" />}
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
        placeholderTextColor="#64748b"
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
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    width: '100%',
    marginBottom: 24,
  },
  title: {
    color: '#1e293b',
    fontFamily: FONTS.bold,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    color: '#1e293b',
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 307,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  field: {
    marginBottom: 23,
  },
  label: {
    marginBottom: 8,
    color: '#1e293b',
    fontFamily: FONTS.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  input: {
    height: 45,
    borderRadius: 10,
    borderWidth: 1.162,
    borderColor: '#e5e7eb',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: '#1e293b',
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  termsRow: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  checkboxChecked: {
    backgroundColor: '#fc4c02',
    borderColor: '#fc4c02',
  },
  termsText: {
    flex: 1,
    color: '#64748b',
    fontFamily: FONTS.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
  },
  termsLink: {
    color: '#1e293b',
    fontFamily: FONTS.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
  },
  button: {
    marginTop: 24,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#1e293b',
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  loginLink: {
    color: '#fc4d04',
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    fontWeight: '600',
  },
} as const;
