import React from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { GradientButton } from '../components/GradientButton';
import { PageFrame } from '../components/PageFrame';
import { FONTS } from '../constants/fonts';
import { useStyles } from '../utils/responsiveStyles';

function ClockIcon({ size = 16, color = '#464646' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path
        d="M12 7v5l3 2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PendingApprovalScreen({
  ownerName = 'Owner',
  status = 'PENDING',
  rejectionReason,
  onRetryKyc,
}: {
  ownerName?: string;
  status?: string;
  rejectionReason?: string;
  onRetryKyc?: () => void;
}) {
  const styles = useStyles(RAW_STYLES);
  const isRejected = status === 'REJECTED';
  const reasonText = rejectionReason?.trim();
  const heading = isRejected ? 'KYC Rejected' : `Thank You, ${ownerName}`;

  return (
    <PageFrame
      title="Registration Pending Approval"
      scroll={false}
      titleStyle={styles.pageTitle}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>{heading}</Text>

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
              Your <Text style={styles.bodyStrong}>documents</Text> have been successfully submitted.
            </>
          )}
        </Text>

        <Text style={styles.subBody}>
          {isRejected
            ? rejectionReason || 'Please update the missing or incorrect documents and submit again.'
            : 'Our verification team is reviewing your details.\nYou will be notified once your account is approved.'}
        </Text>

        {isRejected ? (
          <View style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>Rejection reason</Text>
            <Text style={styles.reasonText}>
              {reasonText || 'Please update the missing or incorrect documents and submit again.'}
            </Text>
          </View>
        ) : null}

        <View style={styles.etaCard}>
          <View style={styles.etaLeft}>
            <ClockIcon size={18} color="#464646" />
            <View style={styles.etaTextWrap}>
              <Text style={styles.etaLabel}>Estimated verification time:</Text>
              <Text style={styles.etaValue}>
                {isRejected ? 'Please update the missing details' : 'Within 24 hours'}
              </Text>
            </View>
          </View>
          <View style={styles.etaPill}>
            <Text style={styles.etaPillText}>
              {isRejected ? 'ACTION NEEDED' : 'UNDER REVIEW'}
            </Text>
          </View>
        </View>

        {isRejected ? (
          <GradientButton
            label="Update KYC"
            onPress={onRetryKyc || (() => undefined)}
            style={styles.button}
            height={50}
            radius={25}
          />
        ) : (
          <GradientButton
            label="Waiting for Approval"
            onPress={() => undefined}
            style={styles.button}
            height={50}
            radius={25}
          />
        )}

        <Text style={styles.note}>
          Once approved, you&apos;ll receive a notification and can start using your dashboard.
        </Text>
      </View>
    </PageFrame>
  );
}

const RAW_STYLES = {
  pageTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    color: '#2f2f2f',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  heroWrap: {
    width: '100%',
    height: 205,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroImage: {
    width: 252,
    height: 205,
  },
  body: {
    color: '#8a8a8a',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  bodyStrong: {
    color: '#3f3f3f',
    fontWeight: '700',
  },
  subBody: {
    marginTop: 16,
    color: '#8a8a8a',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  reasonCard: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(252,76,2,0.18)',
    backgroundColor: 'rgba(252,76,2,0.06)',
  },
  reasonLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  reasonText: {
    color: '#353535',
    fontSize: 14,
    lineHeight: 21,
  },
  etaCard: {
    marginTop: 24,
    width: '100%',
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    backgroundColor: 'rgba(255,255,255,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  etaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  etaTextWrap: {
    flex: 1,
  },
  etaLabel: {
    color: '#3f3f3f',
    fontSize: 15,
    lineHeight: 22,
  },
  etaValue: {
    color: '#3f3f3f',
    fontSize: 15,
    lineHeight: 22,
  },
  etaPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f6d3bc',
  },
  etaPillText: {
    color: '#3a3a3a',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    letterSpacing: 0.3,
  },
  button: {
    marginTop: 28,
    width: '100%',
  },
  note: {
    marginTop: 20,
    color: '#8a8a8a',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
} as const;
