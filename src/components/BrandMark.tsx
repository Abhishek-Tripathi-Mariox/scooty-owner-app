import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';

const SlydoLogo = require('../assets/images/slydo-logo-upright.png');

export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <View style={styles.lockup}>
        <Image source={SlydoLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.wordmark}>
          <Text style={styles.title}>Slydo</Text>
          <Text style={styles.titleSub}>Mobility</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Vehicle Owner Portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 62,
    height: 62,
    marginRight: 14,
  },
  wordmark: {
    alignItems: 'center',
  },
  title: {
    color: '#171717',
    fontFamily: FONTS.medium,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  titleSub: {
    marginTop: -4,
    color: '#171717',
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 22,
  },
  subtitle: {
    marginTop: 22,
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
});
