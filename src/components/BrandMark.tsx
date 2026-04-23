import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';

export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <View style={StyleSheet.absoluteFillObject}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="brandBadge" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#fc4d03" stopOpacity="1" />
                <Stop offset="100%" stopColor="#ff7a45" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#brandBadge)" rx={24} ry={24} />
          </Svg>
        </View>
        <Image
          source={require('../assets/images/Container.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>MOVYRA</Text>
      <Text style={styles.subtitle}>Vehicle Owner Portal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  badge: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#f0b79d',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  logo: {
    width: 62,
    height: 56,
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
