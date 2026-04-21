import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export function OtpBoxes({
  otp,
  length,
}: {
  otp: string;
  length: number;
}) {
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const digit = otp[index] ?? 'X';
        return (
          <View key={`otp-${index}`} style={styles.box}>
            <Text style={styles.boxText}>{digit}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: '#ece4e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
