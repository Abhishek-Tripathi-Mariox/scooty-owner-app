import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GradientButton } from '../components/GradientButton';
import { KycFrame } from '../components/KycFrame';
import { UploadArrowIcon } from '../components/OwnerIcons';
import { FONTS } from '../constants/fonts';
import type { KycUploadFiles } from '../services/ownerApi';
import { useStyles } from '../utils/responsiveStyles';

type KycField = keyof KycUploadFiles;

// Figma 477-14094 "Complete KYC / Upload Documents": label, then a 126px
// frosted card with the upload glyph and a hint, centred.
function UploadCard({
  label,
  hint,
  fileName,
  onPress,
}: {
  label: string;
  hint: string;
  fileName?: string;
  onPress: () => void;
}) {
  const styles = useStyles(RAW_STYLES);
  const isUploaded = Boolean(fileName);
  return (
    <View style={styles.uploadBlock}>
      <Text style={styles.uploadLabel}>{label}</Text>
      <Pressable
        style={[styles.uploadCard, isUploaded && styles.uploadCardSelected]}
        onPress={onPress}
      >
        <UploadArrowIcon size={32} color={isUploaded ? '#fc4c02' : '#99a1af'} />
        <Text
          style={[styles.uploadHint, isUploaded && styles.uploadHintSelected]}
          numberOfLines={1}
        >
          {fileName || hint}
        </Text>
      </Pressable>
    </View>
  );
}

export function KycScreen({
  onBack,
  onNext,
  onSubmit,
  onPickDocument,
  documents,
  requestedDocument,
  existingDocuments,
  loading = false,
}: {
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onPickDocument: (field: KycField) => void;
  documents: KycUploadFiles;
  requestedDocument?: KycField | null;
  existingDocuments?: {
    adharFileUrl?: string;
    adharBackFileUrl?: string;
    panFileUrl?: string;
    profilePhotoUrl?: string;
  };
  loading?: boolean;
}) {
  const styles = useStyles(RAW_STYLES);
  const isChangeRequest = Boolean(requestedDocument);
  // Mandatory: Aadhaar front + back, PAN, profile photo (no driving licence for owners).
  const isReady = isChangeRequest
    ? Boolean(requestedDocument && documents[requestedDocument])
    : Boolean(
        (documents.adharFile || existingDocuments?.adharFileUrl) &&
          (documents.adharBackFile || existingDocuments?.adharBackFileUrl) &&
          (documents.panFile || existingDocuments?.panFileUrl) &&
          (documents.profilePhoto || existingDocuments?.profilePhotoUrl),
      );
  const existingLabel = (url?: string) => (url ? 'Current document uploaded' : undefined);

  return (
    <KycFrame title="Complete KYC" progress={50} onBack={onBack}>
      <Text style={styles.sectionTitle}>Upload Documents</Text>

      <UploadCard
        label="Upload Aadhaar Card (Front)"
        hint="Click to upload Aadhaar front side"
        fileName={documents.adharFile?.name || existingLabel(existingDocuments?.adharFileUrl)}
        onPress={() => onPickDocument('adharFile')}
      />
      <UploadCard
        label="Upload Aadhaar Card (Back)"
        hint="Click to upload Aadhaar back side"
        fileName={documents.adharBackFile?.name || existingLabel(existingDocuments?.adharBackFileUrl)}
        onPress={() => onPickDocument('adharBackFile')}
      />
      <UploadCard
        label="Upload PAN Card"
        hint="Click to upload PAN Card"
        fileName={documents.panFile?.name || existingLabel(existingDocuments?.panFileUrl)}
        onPress={() => onPickDocument('panFile')}
      />
      <UploadCard
        label="Upload Profile Photo"
        hint="Click to upload photo"
        fileName={documents.profilePhoto?.name || existingLabel(existingDocuments?.profilePhotoUrl)}
        onPress={() => onPickDocument('profilePhoto')}
      />

      <GradientButton
        label={loading ? 'Submitting...' : isChangeRequest ? 'Submit' : 'Next'}
        onPress={isChangeRequest ? onSubmit : onNext}
        disabled={loading || !isReady}
        height={48}
        radius={14}
      />
    </KycFrame>
  );
}

const RAW_STYLES = {
  sectionTitle: {
    color: '#1e293b',
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 16,
  },
  uploadBlock: {
    marginBottom: 16,
  },
  uploadLabel: {
    marginBottom: 8,
    color: '#1e293b',
    fontFamily: FONTS.medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  uploadCard: {
    height: 126,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  uploadCardSelected: {
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(255, 244, 239, 0.5)',
  },
  uploadHint: {
    color: '#6a7282',
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  uploadHintSelected: {
    color: '#fc4c02',
    fontFamily: FONTS.medium,
    fontWeight: '500',
  },
} as const;
