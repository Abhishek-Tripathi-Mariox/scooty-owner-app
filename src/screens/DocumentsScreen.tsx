import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  InfoIcon,
  SquarePenIcon as PencilIcon,
} from '../components/OwnerIcons';
import { Owner, OwnerKyc, VehicleItem } from '../services/ownerApi';
import { formatShortDate } from '../utils/format';

type DocStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'NOT_SUBMITTED';

function statusBadge(status: DocStatus) {
  if (status === 'VERIFIED') {
    return (
      <View style={styles.verifiedPill}>
        <Text style={styles.verifiedPillText}>✓ Verified</Text>
      </View>
    );
  }
  if (status === 'UNDER_REVIEW') {
    return (
      <View style={styles.reviewPill}>
        <ClockIcon size={12} color="#ffa726" />
        <Text style={styles.reviewPillText}>Under Review</Text>
      </View>
    );
  }
  return (
    <View style={styles.notSubmittedPill}>
      <Text style={styles.notSubmittedPillText}>Not submitted</Text>
    </View>
  );
}

function DocCard({
  emoji,
  title,
  status,
  expiryDate,
  uploadedAt,
  onView,
  onRequestChange,
}: {
  emoji: string;
  title: string;
  status: DocStatus;
  expiryDate?: string;
  uploadedAt?: string;
  onView?: () => void;
  onRequestChange?: () => void;
}) {
  return (
    <View style={styles.docCard}>
      <View style={styles.docHeader}>
        <View style={styles.docIconWrap}>
          <Text style={styles.docEmoji}>{emoji}</Text>
        </View>
        <View style={styles.docTitleWrap}>
          <Text style={styles.docTitle}>{title}</Text>
          <View style={styles.docStatusRow}>{statusBadge(status)}</View>
        </View>
      </View>

      <View style={styles.docMetaList}>
        {expiryDate ? (
          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaLabel}>Expiry Date:</Text>
            <Text style={styles.docMetaValue}>{expiryDate}</Text>
          </View>
        ) : null}
        {uploadedAt ? (
          <View style={styles.docMetaRow}>
            <Text style={styles.docMetaLabel}>Uploaded:</Text>
            <Text style={styles.docMetaValue}>{uploadedAt}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.viewButton} onPress={onView}>
          <EyeIcon size={14} color="#fc4c02" />
          <Text style={styles.viewButtonText}>View Document</Text>
        </Pressable>
        <Pressable style={styles.requestButton} onPress={onRequestChange}>
          <PencilIcon size={14} color="#fc4c02" />
          <Text style={styles.requestButtonText}>Request Change</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function DocumentsScreen({
  onBack,
  owner,
  kyc,
  vehicles = [],
  onViewAadhaar,
  onViewPan,
  onViewInsurance,
  onRequestChange,
}: {
  onBack: () => void;
  owner?: Owner | null;
  kyc?: OwnerKyc | null;
  vehicles?: VehicleItem[];
  onViewAadhaar?: () => void;
  onViewPan?: () => void;
  onViewInsurance?: () => void;
  onRequestChange?: (field: 'adharFile' | 'panFile' | 'profilePhoto' | 'insurance') => void;
}) {
  const firstVehicle = vehicles[0] || null;
  const kycStatus = kyc?.status || owner?.kycStatus;
  const aadhaarStatus: DocStatus =
    kycStatus === 'APPROVED' ? 'VERIFIED' : kycStatus === 'PENDING' ? 'UNDER_REVIEW' : 'NOT_SUBMITTED';
  const panStatus = aadhaarStatus;
  const insuranceStatus: DocStatus = firstVehicle?.documents?.insuranceUrl
    ? 'UNDER_REVIEW'
    : 'NOT_SUBMITTED';
  const submittedAt = kyc?.submittedAt || owner?.kycSubmittedAt;
  const uploadedLabel = submittedAt ? formatShortDate(submittedAt) : undefined;

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.heading}>Documents</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeCard}>
          <InfoIcon size={20} color="#fc4c02" />
          <Text style={styles.noticeText}>
            Your documents are verified by the Movyra admin team. You can request a change if any document is outdated or incorrect.
          </Text>
        </View>

        <DocCard
          emoji="📋"
          title="Insurance"
          status={insuranceStatus}
          onView={onViewInsurance}
          onRequestChange={() => onRequestChange?.('insurance')}
        />

        <DocCard
          emoji="🆔"
          title="Aadhaar"
          status={aadhaarStatus}
          uploadedAt={uploadedLabel}
          onView={onViewAadhaar}
          onRequestChange={() => onRequestChange?.('adharFile')}
        />

        <DocCard
          emoji="💳"
          title="PAN"
          status={panStatus}
          uploadedAt={uploadedLabel}
          onView={onViewPan}
          onRequestChange={() => onRequestChange?.('panFile')}
        />
      </ScrollView>
    </View>
  );
}

// suppress unused warning for CheckIcon (kept available if design shifts)
void CheckIcon;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  topbar: {
    height: 82,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.62)',
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
  heading: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 32,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 12,
  },
  noticeCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: 'rgba(252,76,2,0.2)',
    backgroundColor: 'rgba(227,242,253,0.25)',
    paddingHorizontal: 17,
    paddingVertical: 17,
  },
  noticeText: {
    flex: 1,
    color: '#364153',
    fontSize: 12,
    lineHeight: 19.5,
  },
  docCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(245, 241, 241, 0.46)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  docIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(252,76,2,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docEmoji: {
    fontSize: 24,
  },
  docTitleWrap: {
    flex: 1,
    gap: 4,
  },
  docTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  docStatusRow: {
    flexDirection: 'row',
  },
  verifiedPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(252,76,2,0.1)',
  },
  verifiedPillText: {
    color: '#fc4c02',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  reviewPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fff3e0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewPillText: {
    color: '#ffa726',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  notSubmittedPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(100,116,139,0.15)',
  },
  notSubmittedPillText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  docMetaList: {
    gap: 8,
  },
  docMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docMetaLabel: {
    color: '#4a5565',
    fontSize: 13,
    lineHeight: 19.5,
  },
  docMetaValue: {
    color: '#101828',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19.5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(252,76,2,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewButtonText: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  requestButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.162,
    borderColor: '#fc4c02',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  requestButtonText: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
