import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

const keypadLetters: Record<string, string> = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz',
};

export function OtpKeypad({
  onKeyPress,
  onBackspace,
}: {
  onKeyPress: (value: string) => void;
  onBackspace: () => void;
}) {
  return (
    <View style={styles.keypad}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
        <Pressable key={key} style={styles.key} onPress={() => onKeyPress(key)}>
          <Text style={styles.keyNumber}>{key}</Text>
          <Text style={styles.keyLetters}>{key === '1' ? '' : keypadLetters[key]}</Text>
        </Pressable>
      ))}

      <View style={styles.spacer} />
      <Pressable style={styles.key} onPress={() => onKeyPress('0')}>
        <Text style={styles.keyNumber}>0</Text>
      </Pressable>
      <Pressable style={styles.backspace} onPress={onBackspace}>
        <Text style={styles.backspaceText}>Del</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: {
    width: '100%',
    paddingTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: '31%',
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(215, 221, 228, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    shadowColor: '#d4c1bb',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 10,
  },
  keyNumber: {
    color: '#232b38',
    fontSize: 18,
    fontWeight: '700',
  },
  keyLetters: {
    color: '#5f6770',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 1,
    textTransform: 'lowercase',
  },
  spacer: {
    width: '31%',
    marginBottom: 10,
  },
  backspace: {
    width: '31%',
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(215, 221, 228, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backspaceText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
});
