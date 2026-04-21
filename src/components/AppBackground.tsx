import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

type BackgroundVariant = 'default' | 'auth' | 'otp';

const VARIANTS: Record<
  BackgroundVariant,
  {
    base: string;
    top: string;
    mid: string;
    bottom: string;
    topRight: string;
    bottomLeft: string;
  }
> = {
  default: {
    base: '#f5e6df',
    top: '#f8dfce',
    mid: '#f6e3d4',
    bottom: '#f4ccd3',
    topRight: '#f4d7c8',
    bottomLeft: '#efc8d2',
  },
  auth: {
    base: '#f5e6df',
    top: '#f8dfce',
    mid: '#f6e3d4',
    bottom: '#f4ccd3',
    topRight: '#f4d7c8',
    bottomLeft: '#efc8d2',
  },
  otp: {
    base: '#f4ddd2',
    top: '#f7ddcd',
    mid: '#f5e1d3',
    bottom: '#d3dae5',
    topRight: '#ecd9cc',
    bottomLeft: '#e7cfd6',
  },
};

export function AppBackground({ variant = 'default' }: { variant?: BackgroundVariant }) {
  const colors = VARIANTS[variant];

  return (
    <>
      <View pointerEvents="none" style={styles.base}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bgLinear" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.top} stopOpacity="0.92" />
              <Stop offset="0.45" stopColor={colors.mid} stopOpacity="0.58" />
              <Stop offset="1" stopColor={colors.bottom} stopOpacity="0.86" />
            </LinearGradient>
            <RadialGradient id="topGlow" cx="50%" cy="10%" rx="78%" ry="42%">
              <Stop offset="0" stopColor={colors.top} stopOpacity="0.42" />
              <Stop offset="1" stopColor={colors.top} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="rightWarmGlow" cx="100%" cy="45%" rx="45%" ry="58%">
              <Stop offset="0" stopColor={colors.topRight} stopOpacity="0.26" />
              <Stop offset="1" stopColor={colors.topRight} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="leftPinkGlow" cx="0%" cy="78%" rx="54%" ry="52%">
              <Stop offset="0" stopColor={colors.bottomLeft} stopOpacity="0.3" />
              <Stop offset="1" stopColor={colors.bottomLeft} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="whiteWash" cx="50%" cy="35%" rx="95%" ry="95%">
              <Stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
              <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill={colors.base} />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgLinear)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#topGlow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#rightWarmGlow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#leftPinkGlow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#whiteWash)" />
        </Svg>
      </View>
      <View pointerEvents="none" style={styles.softWash} />
    </>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  softWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    opacity: 0.04,
  },
});
