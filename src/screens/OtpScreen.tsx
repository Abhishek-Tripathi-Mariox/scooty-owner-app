import React, { useEffect, useRef, useState } from 'react';
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
import { OtpBoxes } from '../components/OtpBoxes';
import { DEFAULT_PHONE_NUMBER, OTP_LENGTH, RESEND_SECONDS } from '../constants/auth';
import { COLORS } from '../constants/theme';
import { useResponsiveLayout } from '../utils/responsive';
import { useStyles } from '../utils/responsiveStyles';

export function OtpScreen({
  phoneNumber,
  otp,
  onOtpChange,
  onBack,
  onChangeNumber,
  onVerify,
  onResend,
  loading = false,
}: {
  phoneNumber: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onBack: () => void;
  onChangeNumber: () => void;
  onVerify: () => void;
  onResend?: () => void;
  loading?: boolean;
}) {
  const layout = useResponsiveLayout();
  const styles = useStyles(RAW_STYLES);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const otpInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setSecondsLeft(RESEND_SECONDS);
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      otpInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleOtpInputChange = (value: string) => {
    onOtpChange(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    onResend?.();
  };

  const focusOtp = () => otpInputRef.current?.focus();
  const canVerify = otp.length >= OTP_LENGTH && !loading;

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
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a {OTP_LENGTH}-digit code to{'\n'}
            <Text style={styles.phone}>+91 {phoneNumber || DEFAULT_PHONE_NUMBER}</Text>
          </Text>
        </View>

        <Pressable onPress={focusOtp} style={styles.card}>
          <Text style={styles.cardLabel}>Enter OTP</Text>
          <OtpBoxes otp={otp} length={OTP_LENGTH} activeIndex={otp.length} />
          <TextInput
            ref={otpInputRef}
            value={otp}
            onChangeText={handleOtpInputChange}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            caretHidden
            contextMenuHidden
            importantForAutofill="no"
            returnKeyType="done"
            style={styles.hiddenInput}
          />

          <Text style={styles.resendText}>
            {secondsLeft > 0 ? (
              <>
                Resend OTP in <Text style={styles.resendAccent}>{secondsLeft}s</Text>
              </>
            ) : (
              <Text style={styles.resendAccent} onPress={handleResend}>
                Resend OTP
              </Text>
            )}
          </Text>

          <GradientButton
            label={loading ? 'Verifying...' : 'Verify & Continue  →'}
            onPress={onVerify}
            disabled={!canVerify}
            height={layout.buttonHeight}
            radius={14}
            style={styles.button}
          />
        </Pressable>

        <Text style={styles.changeNumberText}>
          Didn&apos;t receive the code?{' '}
          <Text style={styles.changeNumberLink} onPress={onChangeNumber}>
            Change number
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 32,
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
    marginBottom: 32,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    color: '#717182',
    fontSize: 14,
    lineHeight: 20,
  },
  phone: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.62)',
  },
  cardLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  resendText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#3f3f53',
    fontSize: 12,
    lineHeight: 16,
  },
  resendAccent: {
    color: '#fc4c02',
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
  },
  changeNumberText: {
    marginTop: 32,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 24,
  },
  changeNumberLink: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    left: -1000,
    top: -1000,
  },
} as const;
