import React from 'react';
import { StyleSheet, View } from 'react-native';

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#8b8f98',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#1e2939',
    borderRadius: 999,
  },
});
