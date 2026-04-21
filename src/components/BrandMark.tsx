import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';

export function BrandMark() {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Image
          source={require('../assets/images/Container.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.pill}>
        <Text style={styles.pillText}>Vehicle Owner Portal</Text>
      </View>
      <Text style={styles.title}>MOVYRA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  badge: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.46)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#f0b79d',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  logo: {
    width: 88,
    height: 88,
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  pillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 35,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
