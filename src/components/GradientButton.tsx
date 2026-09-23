import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';
import { useStyles } from '../utils/responsiveStyles';

export function GradientButton({
  label,
  onPress,
  style,
  disabled,
  height = 56,
  radius = 12,
  rightIcon,
  leftIcon,
  labelStyle,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  height?: number;
  radius?: number;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  labelStyle?: TextStyle;
}) {
  const styles = useStyles(RAW_STYLES);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { height, borderRadius: radius },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFillObject, { borderRadius: radius, overflow: 'hidden' }]}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="ownerBtnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={COLORS.brandPrimary} stopOpacity="1" />
              <Stop offset="100%" stopColor={COLORS.brandSecondary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#ownerBtnGrad)" />
        </Svg>
      </View>
      {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </Pressable>
  );
}

const RAW_STYLES = {
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    color: '#ffffff',
    fontFamily: FONTS.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
} as const;
