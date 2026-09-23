import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { AppBackground } from './AppBackground';
import { ArrowLeftIcon } from './OwnerIcons';
import { COLORS, SPACING } from '../constants/theme';
import { useStyles } from '../utils/responsiveStyles';
import { useScreenInsets } from '../utils/insets';

export function PageFrame({
  children,
  title,
  subtitle,
  onBack,
  scroll = true,
  topRight,
  titleStyle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  scroll?: boolean;
  topRight?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}) {
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {scroll ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: 32 + insets.bottom },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
          >
            <FrameChrome
              title={title}
              subtitle={subtitle}
              onBack={onBack}
              topRight={topRight}
              titleStyle={titleStyle}
            />
            <View style={styles.body}>{children}</View>
          </ScrollView>
        ) : (
          <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <FrameChrome
              title={title}
              subtitle={subtitle}
              onBack={onBack}
              topRight={topRight}
              titleStyle={titleStyle}
            />
            <View style={styles.body}>{children}</View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FrameChrome({
  title,
  subtitle,
  onBack,
  topRight,
  titleStyle,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  topRight?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}) {
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
  return (
    <>
      <View style={[styles.searchLabelRow, { paddingTop: insets.headerTop }]}>
      </View>
      <View style={styles.headerRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
            <ArrowLeftIcon size={20} color="#171717" />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.topRight}>{topRight}</View>
      </View>
    </>
  );
}

const RAW_STYLES = {
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
  },
  searchLabelRow: {
    paddingHorizontal: SPACING.screenX,
  },
  searchLabel: {
    color: '#8d888c',
    fontSize: 12,
  },
  headerRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.screenX,
    paddingBottom: 30,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: -4,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    shadowColor: '#d9b7ab',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  backPlaceholder: {
    width: 38,
    height: 38,
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  topRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 24,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.screenX,
    paddingTop: 0,
  },
} as const;
