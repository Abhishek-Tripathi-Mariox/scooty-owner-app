import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { OtpBoxes } from '../components/OtpBoxes';
import { OtpKeypad } from '../components/OtpKeypad';
import { PrimaryButton } from '../components/PrimaryButton';
import { DEFAULT_PHONE_NUMBER, OTP_LENGTH, RESEND_SECONDS } from '../constants/auth';
import { COLORS, SPACING } from '../constants/theme';

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
    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleOtpInputChange = (value: string) => {
    onOtpChange(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
  };

  const handleKeyPress = (value: string) => {
    if (otp.length >= OTP_LENGTH) {
      return;
    }

    onOtpChange(`${otp}${value}`);
  };

  const handleBackspace = () => {
    onOtpChange(otp.slice(0, -1));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppBackground variant="otp" />

      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a {OTP_LENGTH}-digit code to{'\n'}
          <Text style={styles.phone}>+91 {phoneNumber || DEFAULT_PHONE_NUMBER}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Enter OTP</Text>
        <OtpBoxes otp={otp} length={OTP_LENGTH} />
        <TextInput
          ref={otpInputRef}
          value={otp}
          onChangeText={handleOtpInputChange}
          keyboardType="number-pad"
          autoFocus
          showSoftInputOnFocus={false}
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
            <Text style={styles.resendAccent} onPress={onResend}>
              Resend OTP
            </Text>
          )}
        </Text>

        <PrimaryButton
          label={loading ? 'Verifying...' : 'Verify & Continue  →'}
          onPress={onVerify}
          style={styles.button}
          disabled={otp.length < OTP_LENGTH}
        />
      </View>

      <Text style={styles.changeNumberText}>
        Didn&apos;t receive the code?{' '}
        <Text style={styles.changeNumberLink} onPress={onChangeNumber}>
          Change number
        </Text>
      </Text>

      <OtpKeypad onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.screenX,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: 'transparent',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.textPrimary,
    marginTop: -4,
  },
  header: {
    width: '100%',
    paddingBottom: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6e6970',
    fontSize: 13,
    lineHeight: 18,
  },
  phone: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  card: {
    width: '100%',
    borderRadius: SPACING.cardRadius,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: COLORS.cardStrong,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  cardLabel: {
    color: '#2e3444',
    fontSize: 13,
    fontWeight: '700',
  },
  resendText: {
    marginTop: 18,
    textAlign: 'center',
    color: '#6d666c',
    fontSize: 12,
  },
  resendAccent: {
    color: COLORS.button,
    fontWeight: '800',
  },
  button: {
    marginTop: 16,
  },
  changeNumberText: {
    marginTop: 24,
    color: '#615c63',
    fontSize: 13,
  },
  changeNumberLink: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    left: -1000,
    top: -1000,
  },
});
