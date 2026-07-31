import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BrandMark } from '../components/BrandMark';
import { GradientButton } from '../components/GradientButton';
import { ArrowRightIcon, CheckIcon } from '../components/OwnerIcons';
import { PhoneIcon } from '../components/PhoneIcon';
import { COLORS } from '../constants/theme';
import { scaleSize, useResponsiveLayout } from '../utils/responsive';
import { useStyles } from '../utils/responsiveStyles';

const MOBILE_LENGTH = 10;

export function LoginScreen({
  mobileNumber,
  acceptedTerms,
  onToggleTerms,
  onChangeMobile,
  onContinue,
  onRegisterPress,
  loading = false,
}: {
  mobileNumber: string;
  acceptedTerms: boolean;
  onToggleTerms: () => void;
  onChangeMobile: (value: string) => void;
  onContinue: () => void;
  onRegisterPress?: () => void;
  loading?: boolean;
}) {
  const layout = useResponsiveLayout();
  const styles = useStyles(RAW_STYLES);
  const canSubmit = acceptedTerms && mobileNumber.length === MOBILE_LENGTH && !loading;
  const iconSize = scaleSize(20, layout.screenWidth);

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.brandBlock}>
        <BrandMark />
      </View>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Mobile Number</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputIconWrap}>
            <PhoneIcon width={iconSize} height={iconSize} />
          </View>
          <TextInput
            value={mobileNumber}
            onChangeText={(value) => onChangeMobile(value.replace(/\D/g, '').slice(0, MOBILE_LENGTH))}
            placeholder="Enter your mobile number"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="phone-pad"
            maxLength={MOBILE_LENGTH}
            style={styles.input}
          />
        </View>

        <Pressable style={styles.termsRow} onPress={onToggleTerms}>
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <CheckIcon size={14} color="#ffffff" /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Pressable>

        <GradientButton
          label={loading ? 'Sending OTP...' : 'Send OTP'}
          onPress={onContinue}
          disabled={!canSubmit}
          height={layout.buttonHeight}
          radius={12}
          style={styles.sendButton}
          rightIcon={loading ? undefined : <ArrowRightIcon size={18} color="#ffffff" />}
        />
      </View>

      <View style={styles.footerBlock}>
        <Text style={styles.footerHint}>New to MOVYRA?</Text>
        <Text style={styles.footerLink} onPress={onRegisterPress}>
          Register as Vehicle Owner
        </Text>
      </View>

        <Text style={styles.copyright}>© 2026 MOVYRA. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const RAW_STYLES = {
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  brandBlock: {
    marginBottom: 48,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  inputRow: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  inputIconWrap: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  termsRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#a8a4ab',
    marginTop: 3,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 15,
  },
  termsText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 28,
  },
  termsLink: {
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 28,
  },
  sendButton: {
    marginTop: 24,
  },
  footerBlock: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerHint: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  footerLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  copyright: {
    marginTop: 'auto',
    paddingTop: 48,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textSecondary,
  },
} as const;
