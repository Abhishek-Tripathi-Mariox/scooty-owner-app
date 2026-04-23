import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GradientButton } from '../components/GradientButton';
import { PageFrame } from '../components/PageFrame';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS } from '../constants/theme';
import type { KycUploadFiles } from '../services/ownerApi';

type KycField = keyof KycUploadFiles;

function UploadIcon({ size = 32, color = '#6a7282' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v12m0-12-4 4m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
  const isUploaded = Boolean(fileName);
  return (
    <View style={styles.uploadBlock}>
      <Text style={styles.uploadLabel}>{label}</Text>
      <Pressable
        style={[styles.uploadCard, isUploaded && styles.uploadCardSelected]}
        onPress={onPress}
      >
        <UploadIcon size={32} color={isUploaded ? '#fc4c02' : '#6a7282'} />
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
    panFileUrl?: string;
    profilePhotoUrl?: string;
  };
  loading?: boolean;
}) {
  const isChangeRequest = Boolean(requestedDocument);
  const isReady = isChangeRequest
    ? Boolean(requestedDocument && documents[requestedDocument])
    : Boolean(documents.profilePhoto && documents.adharFile && documents.panFile);

  const getHint = (field: KycField, defaultHint: string, existingUrl?: string | undefined) => {
    if (documents[field]?.name) return documents[field]!.name;
    if (existingUrl) return 'Current document uploaded';
    return defaultHint;
  };

  return (
    <PageFrame title="Complete KYC" onBack={onBack} scroll titleStyle={styles.pageTitle}>
      <ProgressBar progress={50} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Documents</Text>

        <UploadCard
          label="Upload Aadhaar"
          hint="Click to upload Aadhaar"
          fileName={
            documents.adharFile?.name ||
            (existingDocuments?.adharFileUrl ? 'Current document uploaded' : undefined)
          }
          onPress={() => onPickDocument('adharFile')}
        />
        <UploadCard
          label="Upload PAN Card"
          hint="Click to upload PAN Card"
          fileName={
            documents.panFile?.name ||
            (existingDocuments?.panFileUrl ? 'Current document uploaded' : undefined)
          }
          onPress={() => onPickDocument('panFile')}
        />
        <UploadCard
          label="Upload Profile Photo"
          hint="Click to upload photo"
          fileName={
            documents.profilePhoto?.name ||
            (existingDocuments?.profilePhotoUrl ? 'Current document uploaded' : undefined)
          }
          onPress={() => onPickDocument('profilePhoto')}
        />
      </View>

      <GradientButton
        label={loading ? 'Submitting...' : isChangeRequest ? 'Submit' : 'Next'}
        onPress={isChangeRequest ? onSubmit : onNext}
        style={styles.button}
        disabled={loading || !isReady}
        height={48}
        radius={14}
      />
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
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
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 14,
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
  },
  uploadCardSelected: {
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(255, 244, 239, 0.5)',
  },
  uploadHint: {
    color: '#6a7282',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  uploadHintSelected: {
    color: '#fc4c02',
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
});
