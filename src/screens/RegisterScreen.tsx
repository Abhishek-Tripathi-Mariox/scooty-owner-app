import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { PageFrame } from '../components/PageFrame';
import { COLORS, SPACING } from '../constants/theme';

export function RegisterScreen({
  fullName,
  address,
  mobileNumber,
  city,
  acceptedTerms,
  onToggleTerms,
  onChangeFullName,
  onChangeAddress,
  onChangeMobile,
  onChangeCity,
  onContinue,
  onLoginPress,
  loading = false,
}: {
  fullName: string;
  address: string;
  mobileNumber: string;
  city: string;
  acceptedTerms: boolean;
  onToggleTerms: () => void;
  onChangeFullName: (value: string) => void;
  onChangeAddress: (value: string) => void;
  onChangeMobile: (value: string) => void;
  onChangeCity: (value: string) => void;
  onContinue: () => void;
  onLoginPress: () => void;
  loading?: boolean;
}) {
  return (
    <PageFrame
      title="Create Account"
      subtitle="Join as a vehicle owner and grow your earnings"
      onBack={onLoginPress}
      scroll
    >
        <View style={styles.card}>
        <LabeledInput label="Full Name" value={fullName} onChangeText={onChangeFullName} placeholder="Enter your full name" />
        <LabeledInput label="Address" value={address} onChangeText={onChangeAddress} placeholder="House / street / area" />
        <LabeledInput label="Mobile Number" value={mobileNumber} onChangeText={onChangeMobile} placeholder="Enter your mobile number" keyboardType="number-pad" />
        <LabeledInput label="City" value={city} onChangeText={onChangeCity} placeholder="City" />

        <Pressable style={styles.termsRow} onPress={onToggleTerms}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Pressable>
      </View>

      <PrimaryButton
        label={loading ? 'Saving...' : 'Continue  →'}
        onPress={onContinue}
        style={styles.button}
        disabled={loading}
      />

      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginLink} onPress={onLoginPress}>Login</Text>
      </Text>
    </PageFrame>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        editable={editable}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACING.cardRadius,
    padding: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 42,
    borderRadius: SPACING.controlRadius,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    color: '#2b3141',
    fontSize: 13,
  },
  termsRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#9b8a90',
    marginTop: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.button,
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 10,
  },
  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  button: {
    marginTop: 14,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 18,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  loginLink: {
    color: COLORS.button,
    fontWeight: '800',
  },
});
