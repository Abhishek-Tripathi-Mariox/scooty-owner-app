import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';

export function AccountActivatedScreen({
  onGoToDashboard,
}: {
  onGoToDashboard: () => void;
}) {
  return (
    <PageFrame title="Account Activated" scroll={false}>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.heading}>Account Activated! 🎉</Text>
        <Text style={styles.text}>
          Your account has been successfully activated.
        </Text>
        <Text style={styles.text}>
          You can now start accepting rides and earning.
        </Text>

        <Pressable style={styles.button} onPress={onGoToDashboard}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </Pressable>
      </View>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 18,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: 44,
    fontWeight: '900',
  },
  heading: {
    marginTop: 18,
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    marginTop: 18,
    width: '100%',
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});
