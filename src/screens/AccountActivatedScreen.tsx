import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { GradientButton } from '../components/GradientButton';
import { COLORS } from '../constants/theme';

function ActivatedIcon({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle
        cx={50}
        cy={50}
        r={42}
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <Path
        d="M32 52l12 12 24-28"
        stroke="#ffffff"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GradientCircle({ size = 144 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 144 144">
      <Defs>
        <LinearGradient id="activatedCircle" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Circle cx={72} cy={72} r={72} fill="url(#activatedCircle)" />
    </Svg>
  );
}

export function AccountActivatedScreen({
  onGoToDashboard,
}: {
  onGoToDashboard: () => void;
}) {
  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />
      <View style={styles.backdrop} />

      <View style={styles.sheet}>
        <View style={styles.iconWrap}>
          <GradientCircle size={144} />
          <View style={styles.iconOverlay} pointerEvents="none">
            <ActivatedIcon size={96} />
          </View>
        </View>

        <Text style={styles.heading}>Account Activated! 🎉</Text>
        <Text style={styles.body}>Your account has been successfully activated.</Text>
        <Text style={styles.body}>You can now start accepting rides and earning.</Text>

        <GradientButton
          label="Go to Dashboard"
          onPress={onGoToDashboard}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          height={56}
          radius={14}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
  },
  iconWrap: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 36,
    textAlign: 'center',
  },
  body: {
    color: '#6a7282',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: -12,
  },
  button: {
    marginTop: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
});
