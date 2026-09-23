import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { AppBackground } from './AppBackground';
import { ArrowLeftIcon } from './OwnerIcons';
import { FONTS } from '../constants/fonts';
import { useScreenInsets } from '../utils/insets';
import { useStyles } from '../utils/responsiveStyles';

// Onboarding KYC chrome from the Figma frames "Complete KYC" (477-14094 and
// 477-14280): a translucent white header with a plain back arrow, the title
// and a dark progress bar, sitting over a full-width frosted panel that holds
// the step's content.
export function KycFrame({
  title,
  progress,
  onBack,
  children,
}: {
  title: string;
  /** 0–100. Omit to hide the progress bar (e.g. the pending-approval screen). */
  progress?: number;
  onBack?: () => void;
  children: ReactNode;
}) {
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
  const fill = progress === undefined ? null : Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.root}>
      <AppBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.headerTop - 4 }]}>
          <View style={styles.headerRow}>
            {onBack ? (
              <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
                <ArrowLeftIcon size={24} color="#1e293b" />
              </Pressable>
            ) : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {fill !== null ? (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${fill}%` }]} />
            </View>
          ) : null}
        </View>

        <ScrollView
          style={[styles.flex, styles.panel]}
          contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const RAW_STYLES = {
  root: {
    flex: 1,
    backgroundColor: '#ffd1b0',
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  back: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: '#1e293b',
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#717182',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 999,
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
} as const;
