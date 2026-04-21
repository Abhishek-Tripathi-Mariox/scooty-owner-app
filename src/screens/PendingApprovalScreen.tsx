import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { PageFrame } from '../components/PageFrame';
import { FONTS } from '../constants/fonts';
import { COLORS } from '../constants/theme';
import VerificationIcon from '../assets/images/Vector.svg';

export function PendingApprovalScreen({
  ownerName = 'Ravi',
  status = 'PENDING',
  rejectionReason,
  onRetryKyc,
}: {
  ownerName?: string;
  status?: string;
  rejectionReason?: string;
  onRetryKyc?: () => void;
}) {
  const isRejected = status === 'REJECTED';
  const title = isRejected ? 'KYC Rejected' : `Thank You, ${ownerName}`;
  const body = isRejected
    ? 'Your KYC request was not approved yet.'
    : 'Your documents have been successfully submitted.';
  const subBody = isRejected
    ? rejectionReason || 'Please update the missing or incorrect documents and submit again.'
    : 'Our verification team is reviewing your details. You will be notified once your account is approved.';

  return (
    <PageFrame
      title="Registration Pending Approval"
      scroll={false}
      titleStyle={styles.pageTitle}
    >
      <View style={styles.shell}>
        <Svg pointerEvents="none" style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="pendingApprovalBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#f8e8db" stopOpacity={1} />
              <Stop offset="56%" stopColor="#fbefe4" stopOpacity={1} />
              <Stop offset="100%" stopColor="#f7d7df" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#pendingApprovalBg)" />
        </Svg>
        <View pointerEvents="none" style={styles.glowBottomLeft} />
        <View pointerEvents="none" style={styles.glowBottomRight} />
        <View style={styles.card}>
          <Text style={styles.heading}>{title}</Text>

          <View style={styles.heroWrap}>
            <Image
              source={require('../assets/images/registration-pending-hero.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.body}>
            {isRejected ? (
              'Your KYC request was not approved yet.'
            ) : (
              <>
                Your <Text style={styles.bodyStrong}>documents</Text> have been successfully
                submitted.
              </>
            )}
          </Text>
          <Text style={styles.subBody}>{subBody}</Text>

          <View style={styles.etaCard}>
            <View style={styles.etaTopRow}>
              <View style={styles.etaLabelRow}>
                <VerificationIcon width={14} height={14} />
                <Text style={styles.etaLabel}>Estimated verification time:</Text>
              </View>
              <Text style={styles.etaPill}>{isRejected ? 'ACTION NEEDED' : 'UNDER REVIEW'}</Text>
            </View>
            <Text style={styles.etaValue}>
              {isRejected ? 'Please update the missing details' : 'Within 24 hours'}
            </Text>
          </View>

          {isRejected ? (
            <Pressable style={styles.button} onPress={onRetryKyc}>
              <Text style={styles.buttonText}>Update KYC</Text>
            </Pressable>
          ) : (
            <View style={[styles.button, styles.buttonDisabled]}>
              <Text style={styles.buttonText}>Waiting for Approval</Text>
            </View>
          )}

          <Text style={styles.note}>
            Once approved, you&apos;ll receive a notification and can continue using the app.
          </Text>
        </View>
      </View>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  glowBottomLeft: {
    position: 'absolute',
    left: -70,
    bottom: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(199, 211, 255, 0.20)',
  },
  glowBottomRight: {
    position: 'absolute',
    right: -90,
    bottom: -95,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(242, 205, 233, 0.26)',
  },
  card: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    backgroundColor: 'rgba(250, 238, 222, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    shadowColor: '#f1b69a',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heading: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  pageTitle: {
    height: 28,
    fontFamily: FONTS.bold,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0,
    includeFontPadding: false,
  },
  heroWrap: {
    marginTop: 18,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    marginTop: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: FONTS.bold,
    fontWeight: '800',
  },
  subBody: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  etaCard: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  etaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  etaLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  etaLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  etaPill: {
    color: '#7c4b24',
    backgroundColor: '#f8d9c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
  },
  etaValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'left',
  },
  button: {
    marginTop: 16,
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  note: {
    marginTop: 14,
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
