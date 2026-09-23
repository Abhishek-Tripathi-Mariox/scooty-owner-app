import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useStyles } from '../utils/responsiveStyles';

export function PhotoSourceSheet({
  visible,
  title = 'Add Photo',
  onTakePhoto,
  onChooseGallery,
  onClose,
}: {
  visible: boolean;
  title?: string;
  onTakePhoto: () => void;
  onChooseGallery: () => void;
  onClose: () => void;
}) {
  const styles = useStyles(RAW_STYLES);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>

          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={onTakePhoto}
          >
            <Text style={styles.optionText}>Take Photo</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={onChooseGallery}
          >
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const RAW_STYLES = {
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  title: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
    paddingVertical: 14,
  },
  option: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  optionPressed: {
    backgroundColor: '#f5f5f5',
  },
  optionText: {
    color: '#fc4c02',
    fontSize: 16,
    lineHeight: 22,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 22,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
} as const;
