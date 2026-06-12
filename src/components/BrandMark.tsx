import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';

const SlydoLogo = require('../assets/images/slydo-logo-upright.png');

export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <Image source={SlydoLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Slydo Mobility</Text>
      <Text style={styles.subtitle}>Vehicle Owner Portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 18,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
