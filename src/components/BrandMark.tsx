import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';

const SlydoLogo = require('../assets/images/slydo-logo-upright.png');

// Centered vertical lockup matching the user app's BrandHeader: big logo on
// top, "Slydo Mobility" below, with the owner-portal tagline underneath.
export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <Image source={SlydoLogo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={1}>
        Slydo Mobility
      </Text>
      <Text style={styles.subtitle}>Vehicle Owner Portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96,
  },
  title: {
    marginTop: 12,
    color: '#151515',
    fontFamily: FONTS.brand,
    fontSize: 26,
    fontWeight: 'normal',
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 8,
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
});
