import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export function NoticeModal({
  visible,
  title,
  message,
  actionLabel = 'OK',
  onAction,
}: {
  visible: boolean;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onAction}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onAction} />
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>i</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28, 20, 18, 0.36)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.98)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff4ef',
    borderWidth: 1,
    borderColor: '#ffd7c8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeText: {
    color: COLORS.button,
    fontSize: 18,
    fontWeight: '900',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  message: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  button: {
    alignSelf: 'flex-end',
    marginTop: 16,
    minWidth: 92,
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,244,239,0.9)',
    borderWidth: 1,
    borderColor: '#ffd7c8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.button,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
