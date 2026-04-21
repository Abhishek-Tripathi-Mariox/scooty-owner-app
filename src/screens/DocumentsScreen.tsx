import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
import { Owner, OwnerKyc, VehicleItem } from '../services/ownerApi';
import { formatShortDate } from '../utils/format';

function DocCard({
  icon,
  title,
  status,
  detail,
  uploadedAt,
  onView,
  onRequestChange,
}: {
  icon: string;
  title: string;
  status: string;
  detail?: string;
  uploadedAt?: string;
  onView?: () => void;
  onRequestChange?: () => void;
}) {
  return (
    <View style={styles.docCard}>
      <View style={styles.docHeader}>
        <View style={styles.docIconWrap}>
          <Text style={styles.docIcon}>{icon}</Text>
        </View>
        <View style={styles.docTitleWrap}>
          <Text style={styles.docTitle}>{title}</Text>
          <Text style={styles.docStatus}>{status}</Text>
        </View>
      </View>

      {detail ? <Text style={styles.docDetail}>{detail}</Text> : null}
      {uploadedAt ? <Text style={styles.docMeta}>{uploadedAt}</Text> : null}

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton} onPress={onView}>
          <Text style={styles.actionButtonText}>View Document</Text>
        </Pressable>
        <Pressable style={styles.actionButtonOutline} onPress={onRequestChange}>
          <Text style={styles.actionButtonOutlineText}>Request Change</Text>
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
  const statusLabel = kycStatus === 'APPROVED' ? 'Verified' : kycStatus === 'PENDING' ? 'Under Review' : 'Not submitted';
  const aadhaarUrl = kyc?.documents?.adharFile || owner?.adharFile || '';
  const panUrl = kyc?.documents?.panFile || owner?.panFile || '';
  const submittedAt = kyc?.submittedAt || owner?.kycSubmittedAt;

  return (
    <PageFrame title="Documents" onBack={onBack} scroll>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Your documents are verified by the Movyra admin team. You can request a change if any document is outdated or incorrect.
        </Text>
      </View>

      <DocCard
        icon="🪪"
        title="Aadhaar"
        status={statusLabel}
        detail={aadhaarUrl ? 'Owner KYC document linked' : 'Upload pending'}
        uploadedAt={submittedAt ? `Uploaded: ${formatShortDate(submittedAt)}` : undefined}
        onView={onViewAadhaar}
        onRequestChange={() => onRequestChange?.('adharFile')}
      />

      <DocCard
        icon="🧾"
        title="PAN"
        status={statusLabel}
        detail={panUrl ? 'Owner KYC document linked' : 'Upload pending'}
        uploadedAt={submittedAt ? `Uploaded: ${formatShortDate(submittedAt)}` : undefined}
        onView={onViewPan}
        onRequestChange={() => onRequestChange?.('panFile')}
      />

      <DocCard
        icon="⛽"
        title="Insurance"
        status={firstVehicle?.documents?.insuranceUrl ? 'Active' : 'Not linked'}
        detail={
          firstVehicle
            ? `${firstVehicle.modelName || 'Vehicle'} insurance document`
            : 'Vehicle insurance will show here once a vehicle is added'
        }
        uploadedAt={firstVehicle?.createdAt ? `Vehicle added: ${formatShortDate(firstVehicle.createdAt)}` : undefined}
        onView={onViewInsurance}
        onRequestChange={() => onRequestChange?.('insurance')}
      />

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Owner Details</Text>
        <Text style={styles.footerText}>{owner?.name || 'Not set'}</Text>
        <Text style={styles.footerText}>{owner?.email || 'No email set'}</Text>
        <Text style={styles.footerText}>{owner?.mobile ? `+91 ${owner.mobile}` : 'No mobile set'}</Text>
      </View>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  notice: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  noticeText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
  docCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  docHeader: { flexDirection: 'row', alignItems: 'center' },
  docIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff4ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docIcon: { fontSize: 18 },
  docTitleWrap: { flex: 1 },
  docTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '900' },
  docStatus: { color: COLORS.button, fontSize: 11, fontWeight: '800', marginTop: 4 },
  docDetail: { marginTop: 10, color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },
  docMeta: { marginTop: 4, color: COLORS.textMuted, fontSize: 10 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  actionButtonOutline: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutlineText: { color: COLORS.button, fontSize: 12, fontWeight: '900' },
  footerCard: {
    marginTop: 2,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
  },
  footerTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '900', marginBottom: 8 },
  footerText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },
});
