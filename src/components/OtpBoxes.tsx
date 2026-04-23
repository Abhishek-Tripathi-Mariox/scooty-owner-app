import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export function OtpBoxes({
  otp,
  length,
  activeIndex,
}: {
  otp: string;
  length: number;
  activeIndex?: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const digit = otp[index] ?? '';
        const isActive = activeIndex === index;
        return (
          <View key={`otp-${index}`} style={[styles.box, isActive && styles.boxActive]}>
            <Text style={styles.boxText}>{digit}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.162,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    borderColor: '#fc4c02',
  },
  boxText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textPrimary,
  },
});
