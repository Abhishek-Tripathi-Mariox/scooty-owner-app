import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SPACING } from '../constants/theme';
import type { KycUploadFiles } from '../services/ownerApi';

type KycField = keyof KycUploadFiles;

function UploadCard({
  label,
  hint,
  fileName,
  onPress,
  actionLabel = 'Upload',
}: {
  label: string;
  hint: string;
  fileName?: string;
  onPress: () => void;
  actionLabel?: string;
}) {
  return (
    <View style={styles.uploadBlock}>
      <Text style={styles.uploadLabel}>{label}</Text>
      <Pressable style={[styles.uploadCard, fileName ? styles.uploadCardSelected : null]} onPress={onPress}>
        <View style={styles.uploadLeft}>
          <Text style={styles.uploadIcon}>{fileName ? '✓' : '⇪'}</Text>
          <View style={styles.uploadTextWrap}>
            <Text style={styles.uploadHint}>{fileName || hint}</Text>
          </View>
        </View>
        <Text style={styles.uploadAction}>{actionLabel}</Text>
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

  const getDocLabel = (field: KycField) => {
    if (requestedDocument === field) return 'Upload replacement';
    return 'Upload';
  };

  const changeRequestMessage = requestedDocument
    ? 'Upload the requested document to replace the existing file. Other documents will remain unchanged unless you update them too.'
    : 'Aadhaar, PAN, and profile photo are required before submission. Uploaded files will show with a check mark.';

  return (
    <PageFrame title="Complete KYC" onBack={onBack} scroll>
      <ProgressBar progress={58} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Documents</Text>
        <Text style={styles.sectionNote}>{changeRequestMessage}</Text>
        <UploadCard
          label="Upload Aadhaar"
          hint={getHint('adharFile', 'Tap to select Aadhaar image or PDF', existingDocuments?.adharFileUrl)}
          fileName={documents.adharFile?.name || undefined}
          onPress={() => onPickDocument('adharFile')}
          actionLabel={getDocLabel('adharFile')}
        />
        <UploadCard
          label="Upload PAN Card"
          hint={getHint('panFile', 'Tap to select PAN image or PDF', existingDocuments?.panFileUrl)}
          fileName={documents.panFile?.name || undefined}
          onPress={() => onPickDocument('panFile')}
          actionLabel={getDocLabel('panFile')}
        />
        <UploadCard
          label="Upload Profile Photo"
          hint={getHint('profilePhoto', 'Tap to select a profile photo', existingDocuments?.profilePhotoUrl)}
          fileName={documents.profilePhoto?.name || undefined}
          onPress={() => onPickDocument('profilePhoto')}
          actionLabel={getDocLabel('profilePhoto')}
        />
      </View>

      <Text style={styles.note}>
        {isChangeRequest
          ? 'Only the requested document is required for replacement. Leave other documents unchanged unless you want to update them too.'
          : 'Aadhaar, PAN, and profile photo are required before submission.'}
      </Text>

      <Pressable style={[styles.button, (!isReady || loading) && styles.buttonDisabled]} onPress={onSubmit} disabled={loading || !isReady}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit KYC'}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onNext}>
        <Text style={styles.secondaryButtonText}>{isChangeRequest ? 'Back to documents' : 'Skip for now'}</Text>
      </Pressable>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  sectionNote: {
    marginBottom: 14,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  uploadBlock: {
    marginBottom: 12,
  },
  uploadLabel: {
    marginBottom: 6,
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  uploadCard: {
    minHeight: 92,
    borderRadius: SPACING.cardRadius,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  uploadAction: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: '800',
  },
  uploadCardSelected: {
    backgroundColor: 'rgba(255, 244, 239, 0.92)',
    borderColor: COLORS.button,
  },
  uploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  uploadIcon: {
    fontSize: 28,
    color: '#95a1b8',
    marginRight: 10,
  },
  uploadTextWrap: {
    flex: 1,
  },
  uploadHint: {
    color: '#6d7084',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  uploadBadge: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,244,239,0.95)',
    color: COLORS.button,
    fontSize: 10,
    fontWeight: '900',
  },
  button: {
    marginTop: 12,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  note: {
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  secondaryButton: {
    marginTop: 10,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.button,
    fontWeight: '800',
    fontSize: 13,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
});
