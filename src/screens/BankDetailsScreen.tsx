import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS } from '../constants/theme';
import { Bank, type KycUploadFile } from '../services/ownerApi';

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
  return (
    <View style={styles.uploadBlock}>
      <Text style={styles.uploadLabel}>{label}</Text>
      <Pressable style={[styles.uploadCard, fileName ? styles.uploadCardSelected : null]} onPress={onPress}>
        <View style={styles.uploadLeft}>
          <Text style={styles.uploadIcon}>{fileName ? '✓' : '⇪'}</Text>
          <Text style={styles.uploadHint}>{fileName || hint}</Text>
        </View>
        <Text style={styles.uploadAction}>{fileName ? 'Uploaded' : 'Upload'}</Text>
      </Pressable>
    </View>
  );
}

export function BankDetailsScreen({
  onBack,
  onOpenEdit,
  showEditModal = false,
  mode = 'profile',
  onPickBankDocument,
  bank,
  form,
  onChangeForm,
  onSubmit,
}: {
  onBack: () => void;
  onOpenEdit: () => void;
  showEditModal?: boolean;
  mode?: 'profile' | 'onboarding';
  onPickBankDocument?: () => void;
  bank?: Bank | null;
  form: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
    bankFile?: KycUploadFile | null;
  };
  onChangeForm: (patch: Partial<{ accountHolderName: string; bankName: string; accountNumber: string; ifsc: string; upiId: string; bankFile: KycUploadFile | null }>) => void;
  onSubmit: () => void;
}) {
  const isOnboarding = mode === 'onboarding';

  if (isOnboarding) {
    return (
      <PageFrame title="Complete KYC" onBack={onBack} scroll>
        <ProgressBar progress={78} />

        <View style={styles.onboardingCard}>
          <Text style={styles.onboardingTitle}>Complete Your Profile</Text>

          <Text style={styles.fieldLabel}>Account Holder Name</Text>
          <TextInput
            value={form.accountHolderName}
            onChangeText={(value) => onChangeForm({ accountHolderName: value })}
            placeholder="As per bank records"
            placeholderTextColor="#8a8592"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>Bank Name</Text>
          <TextInput
            value={form.bankName}
            onChangeText={(value) => onChangeForm({ bankName: value })}
            placeholder="Bank name"
            placeholderTextColor="#8a8592"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>Account Number</Text>
          <TextInput
            value={form.accountNumber}
            onChangeText={(value) => onChangeForm({ accountNumber: value })}
            placeholder="Account number"
            placeholderTextColor="#8a8592"
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>IFSC Code</Text>
          <TextInput
            value={form.ifsc}
            onChangeText={(value) => onChangeForm({ ifsc: value })}
            placeholder="IFSC code"
            placeholderTextColor="#8a8592"
            autoCapitalize="characters"
            style={styles.input}
          />

          <UploadCard
            label="Upload Passbook/Cheque"
            hint="Upload document"
            fileName={form.bankFile?.name || undefined}
            onPress={onPickBankDocument || (() => undefined)}
          />

          <View style={styles.ctaWrap}>
            <Pressable style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitText}>Save & Continue</Text>
            </Pressable>
          </View>
        </View>
      </PageFrame>
    );
  }

  return (
    <View style={styles.root}>
      <PageFrame title="Bank Details" onBack={onBack} scroll={false}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.verifiedCard}>
            <Text style={styles.check}>✓</Text>
            <View style={styles.verifiedCopy}>
              <Text style={styles.verifiedTitle}>Bank Account {bank?.isVerified ? 'Verified' : 'Pending'}</Text>
              <Text style={styles.verifiedText}>Your account is ready for payouts.</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Registered Bank Information</Text>
            <Row label="Account Holder" value={bank?.accountHolderName || 'Not set'} />
            <Row label="Bank Name" value={bank?.bankName || 'Not set'} />
            <Row label="Account Number" value={bank?.accountNumber ? `•••• ${bank.accountNumber.slice(-4)}` : 'Not set'} />
            <Row label="IFSC Code" value={bank?.ifsc || 'Not set'} />
            <Row label="UPI ID" value={bank?.upiId || 'Not set'} />
            <Row label="Linked Mobile" value="Owner mobile" />
          </View>

          <Pressable style={styles.primaryButton} onPress={onOpenEdit}>
            <Text style={styles.primaryButtonText}>Request Bank Details Update</Text>
          </Pressable>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              Your payout requests will be credited only to verified bank accounts. Changes require admin approval before they take effect.
            </Text>
          </View>
        </ScrollView>
      </PageFrame>

      {showEditModal ? (
        <View style={styles.overlay}>
          <View style={styles.backdrop} />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Request Bank Details Update</Text>
            <Text style={styles.modalSubtitle}>
              Update the bank details you want the admin team to review.
            </Text>

            <TextInput
              value={form.accountHolderName}
              onChangeText={(value) => onChangeForm({ accountHolderName: value })}
              placeholder="Account Holder Name *"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            <TextInput
              value={form.bankName}
              onChangeText={(value) => onChangeForm({ bankName: value })}
              placeholder="Bank Name *"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            <TextInput
              value={form.accountNumber}
              onChangeText={(value) => onChangeForm({ accountNumber: value })}
              placeholder="Account Number *"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              style={styles.input}
            />
            <TextInput
              value={form.ifsc}
              onChangeText={(value) => onChangeForm({ ifsc: value })}
              placeholder="IFSC Code *"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              style={styles.input}
            />
            <TextInput
              value={form.upiId}
              onChangeText={(value) => onChangeForm({ upiId: value })}
              placeholder="UPI ID"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            <View style={styles.smallNoteWrap}>
              <Text style={styles.smallNote}>
                All changes will be verified by the admin team before they take effect. You will be notified once approved.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={onBack}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitButton} onPress={onSubmit}>
                <Text style={styles.submitText}>Submit Request</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 16 },
  onboardingCard: {
    backgroundColor: 'rgba(250, 238, 222, 0.92)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  onboardingTitle: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 10,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 11,
    marginBottom: 7,
  },
  uploadBlock: {
    marginTop: 14,
  },
  uploadLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  uploadCard: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cdd6e2',
    backgroundColor: 'rgba(255,255,255,0.64)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadCardSelected: {
    borderColor: COLORS.button,
    backgroundColor: 'rgba(255,244,239,0.92)',
  },
  uploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  uploadIcon: {
    color: '#8fa0bf',
    fontSize: 18,
    fontWeight: '900',
  },
  uploadHint: {
    color: '#6d7084',
    fontSize: 13,
    flexShrink: 1,
  },
  uploadAction: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  ctaWrap: {
    marginTop: 24,
  },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,244,239,0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ffd7c8',
    padding: 12,
    marginBottom: 12,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#ffe6d8',
    color: COLORS.button,
    fontSize: 16,
    fontWeight: '900',
    marginRight: 10,
  },
  verifiedCopy: { flex: 1 },
  verifiedTitle: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '900' },
  verifiedText: { marginTop: 3, fontSize: 11, color: COLORS.textSecondary },
  card: {
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '900', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 36,
    borderBottomWidth: 1,
    borderBottomColor: '#f3ece6',
  },
  label: { color: COLORS.textSecondary, fontSize: 11 },
  value: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '800', maxWidth: '58%' },
  primaryButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#ff641c',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  note: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,244,239,0.84)',
    borderWidth: 1,
    borderColor: '#ffd7c8',
    padding: 12,
  },
  noteText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(35, 27, 24, 0.22)' },
  modal: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e3d8d4',
    backgroundColor: 'rgba(250,247,245,0.96)',
    paddingHorizontal: 15,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 10,
  },
  smallNoteWrap: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,244,239,0.86)',
    borderWidth: 1,
    borderColor: '#ffd7c8',
    padding: 10,
    marginTop: 2,
  },
  smallNote: { color: COLORS.textSecondary, fontSize: 10, lineHeight: 15 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ded7d3',
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff641c',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  submitText: { color: '#fff', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  bottomGlow: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: -36,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(196, 203, 230, 0.26)',
  },
});
