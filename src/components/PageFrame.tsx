import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { AppBackground } from './AppBackground';
import { COLORS, SPACING } from '../constants/theme';

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
            contentContainerStyle={styles.content}
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
          <View style={styles.container}>
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
  return (
    <>
      <View style={styles.searchLabelRow}>
      </View>
      <View style={styles.headerRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
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

const styles = StyleSheet.create({
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
    paddingBottom: 20,
  },
  searchLabelRow: {
    paddingHorizontal: SPACING.screenX,
    paddingTop: 40,
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
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  backText: {
    fontSize: 24,
    color: COLORS.textPrimary,
    marginTop: -2,
  },
  backPlaceholder: {
    width: 28,
    height: 28,
    marginRight: 10,
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
});
