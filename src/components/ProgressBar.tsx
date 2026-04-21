import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#c8c0bf',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.button,
    borderRadius: 999,
  },
});
