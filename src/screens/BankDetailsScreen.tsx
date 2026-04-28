import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { GradientButton } from '../components/GradientButton';
import { PageFrame } from '../components/PageFrame';
import { ProgressBar } from '../components/ProgressBar';
import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
  PencilIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { Bank, Owner, type KycUploadFile } from '../services/ownerApi';

function UploadArrowIcon({ size = 20, color = '#6a7282' }: { size?: number; color?: string }) {
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

export function BankDetailsScreen({
  onBack,
  onOpenEdit,
  showEditModal = false,
  showRemoveSuccess = false,
  mode = 'profile',
  onPickBankDocument,
  bank,
  owner,
  form,
  onChangeForm,
  onSubmit,
}: {
  onBack: () => void;
  onOpenEdit: () => void;
  showEditModal?: boolean;
  showRemoveSuccess?: boolean;
  mode?: 'profile' | 'onboarding';
  onPickBankDocument?: () => void;
  bank?: Bank | null;
  owner?: Owner | null;
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
  const isVerified = Boolean(bank?.isVerified);

  if (isOnboarding) {
    const hasBankFile = Boolean(form.bankFile?.name || bank?.fileUrl);
    const bankFileLabel = form.bankFile?.name || (bank?.fileUrl ? 'Current document uploaded' : 'Upload document');
    return (
      <PageFrame title="Complete KYC" onBack={onBack} scroll titleStyle={styles.onboardingPageTitle}>
        <ProgressBar progress={100} />

        <Text style={styles.onboardingTitle}>Complete Your Profile</Text>

        <View style={styles.onboardingField}>
          <Text style={styles.onboardingLabel}>Account Holder Name</Text>
          <TextInput
            value={form.accountHolderName}
            onChangeText={(value) => onChangeForm({ accountHolderName: value })}
            placeholder="As per bank records"
            placeholderTextColor="#717182"
            style={styles.onboardingInput}
          />
        </View>

        <View style={styles.onboardingField}>
          <Text style={styles.onboardingLabel}>Bank Name</Text>
          <TextInput
            value={form.bankName}
            onChangeText={(value) => onChangeForm({ bankName: value })}
            placeholder="Bank name"
            placeholderTextColor="#717182"
            style={styles.onboardingInput}
          />
        </View>

        <View style={styles.onboardingField}>
          <Text style={styles.onboardingLabel}>Account Number</Text>
          <TextInput
            value={form.accountNumber}
            onChangeText={(value) => onChangeForm({ accountNumber: value })}
            placeholder="Account number"
            placeholderTextColor="#717182"
            keyboardType="number-pad"
            style={styles.onboardingInput}
          />
        </View>

        <View style={styles.onboardingField}>
          <Text style={styles.onboardingLabel}>IFSC Code</Text>
          <TextInput
            value={form.ifsc}
            onChangeText={(value) => onChangeForm({ ifsc: value.toUpperCase() })}
            placeholder="IFSC code"
            placeholderTextColor="#717182"
            autoCapitalize="characters"
            style={styles.onboardingInput}
          />
        </View>

        <View style={styles.onboardingField}>
          <Text style={styles.onboardingLabel}>Upload Passbook/Cheque</Text>
          <Pressable
            style={[styles.onboardingUploadRow, hasBankFile && styles.onboardingUploadRowSelected]}
            onPress={onPickBankDocument || (() => undefined)}
          >
            <Text
              style={[
                styles.onboardingUploadText,
                hasBankFile && styles.onboardingUploadTextSelected,
              ]}
              numberOfLines={1}
            >
              {bankFileLabel}
            </Text>
            <UploadArrowIcon size={20} color={hasBankFile ? '#fc4c02' : '#6a7282'} />
          </Pressable>
        </View>

        <GradientButton
          label="Save & Continue"
          onPress={onSubmit}
          style={styles.onboardingSubmit}
          height={48}
          radius={14}
        />
      </PageFrame>
    );
  }

  return (
    <View style={styles.profileRoot}>
      <AppBackground variant="auth" />

      <View style={styles.profileTopbar}>
        <Pressable onPress={onBack} style={styles.profileBack} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.profileHeading}>Bank Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.profileContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileVerifiedBanner}>
          <View style={styles.profileVerifiedIcon}>
            {isVerified ? (
              <CheckIcon size={20} color="#fc4c02" />
            ) : (
              <InfoIcon size={20} color="#fc4c02" />
            )}
          </View>
          <View style={styles.profileVerifiedTextWrap}>
            <Text style={styles.profileVerifiedTitle}>
              {isVerified ? 'Bank Account Verified' : 'Bank Details Under Review'}
            </Text>
            <Text style={styles.profileVerifiedSub}>
              {isVerified
                ? 'Your account is verified for payouts'
                : 'Your bank details are saved and waiting for approval'}
            </Text>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileCardHeader}>
            <Text style={styles.profileCardTitle}>Registered Bank Information</Text>
          </View>
          <View style={styles.profileRowsWrap}>
            <Row label="Account Holder" value={bank?.accountHolderName || 'Not set'} />
            <Row label="Bank Name" value={bank?.bankName || 'Not set'} />
            <Row
              label="Account Number"
              value={bank?.accountNumber ? `**** ${bank.accountNumber.slice(-4)}` : 'Not set'}
            />
            <Row label="IFSC Code" value={bank?.ifsc || 'Not set'} />
            <Row label="UPI ID" value={bank?.upiId || 'Not set'} />
            <Row label="Passbook/Cheque" value={bank?.fileUrl ? 'Current document uploaded' : 'Not set'} />
            <Row label="Linked Mobile" value={owner?.mobile ? `+91 ${owner.mobile}` : 'Not set'} />
          </View>
        </View>

        <GradientButton
          label="Request Bank Details Update"
          onPress={onOpenEdit}
          height={52}
          radius={12}
          leftIcon={<PencilIcon size={16} color="#ffffff" />}
        />

        <View style={styles.profileInfoCard}>
          <InfoIcon size={20} color="#fc4c02" />
          <Text style={styles.profileInfoText}>
            Your payout requests will be credited only to verified bank accounts. Changes require admin approval before they take effect.
          </Text>
        </View>
      </ScrollView>

      {showRemoveSuccess ? (
        <View style={styles.profileToastWrap} pointerEvents="none">
          <View style={styles.profileToast}>
            <View style={styles.profileToastIcon}>
              <CheckIcon size={12} color="#ffffff" />
            </View>
            <Text style={styles.profileToastText}>Update request sent for admin approval.</Text>
          </View>
        </View>
      ) : null}

      {showEditModal ? (
        <View style={styles.profileOverlay}>
          <Pressable style={styles.profileBackdrop} onPress={onBack} />
          <ScrollView
            style={styles.profileModalScroll}
            contentContainerStyle={styles.profileModalScrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
          >
            <View style={styles.profileModal}>
              <View style={styles.profileModalHeader}>
                <Text style={styles.profileModalTitle}>Request Bank Details Update</Text>
                <Pressable onPress={onBack} style={styles.profileModalClose} hitSlop={10}>
                  <CloseIcon size={20} color="#64748b" />
                </Pressable>
              </View>
              <View style={styles.profileModalBody}>
                <ProfileFormField
                  label="Account Holder Name *"
                  value={form.accountHolderName}
                  onChangeText={(v) => onChangeForm({ accountHolderName: v })}
                />
                <ProfileFormField
                  label="Bank Name *"
                  value={form.bankName}
                  onChangeText={(v) => onChangeForm({ bankName: v })}
                />
                <ProfileFormField
                  label="Account Number *"
                  value={form.accountNumber}
                  onChangeText={(v) => onChangeForm({ accountNumber: v })}
                  keyboardType="number-pad"
                />
                <ProfileFormField
                  label="IFSC Code *"
                  value={form.ifsc}
                  onChangeText={(v) => onChangeForm({ ifsc: v.toUpperCase() })}
                  autoCapitalize="characters"
                />

                <View style={styles.modalUploadField}>
                  <Text style={styles.modalUploadLabel}>Upload Passbook/Cancelled Cheque</Text>
                  <Pressable
                    style={styles.modalUpload}
                    onPress={onPickBankDocument || (() => undefined)}
                  >
                    <UploadArrowIcon size={32} color="#6a7282" />
                    <Text style={styles.modalUploadText}>
                      {form.bankFile?.name || (
                        <>
                          Drag & drop or <Text style={styles.modalUploadLink}>browse</Text>
                        </>
                      )}
                    </Text>
                    <Text style={styles.modalUploadHint}>PNG, JPG or PDF (Max 5MB)</Text>
                  </Pressable>
                </View>

                <View style={styles.modalNotice}>
                  <Text style={styles.modalNoticeText}>
                    ⚠️ All changes will be verified by the admin team before they take effect. You will be notified once approved.
                  </Text>
                </View>

                <View style={styles.profileModalActions}>
                  <Pressable style={styles.profileModalCancel} onPress={onBack}>
                    <Text style={styles.profileModalCancelText}>Cancel</Text>
                  </Pressable>
                  <GradientButton
                    label="Submit Request"
                    onPress={onSubmit}
                    height={48}
                    radius={12}
                    style={styles.profileModalSubmit}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileRowLabel}>{label}</Text>
      <Text style={styles.profileRowValue}>{value}</Text>
    </View>
  );
}

function ProfileFormField({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.modalField}>
      <Text style={styles.modalFieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.modalFieldInput}
        placeholderTextColor="rgba(10,10,10,0.5)"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 16 },
  onboardingPageTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  onboardingTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginTop: 16,
    marginBottom: 16,
  },
  onboardingField: {
    marginBottom: 16,
  },
  onboardingLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    marginBottom: 8,
  },
  onboardingInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  onboardingUploadRow: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.162,
    borderColor: '#d1d5dc',
    backgroundColor: 'transparent',
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onboardingUploadRowSelected: {
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(255,244,239,0.5)',
  },
  onboardingUploadText: {
    color: '#6a7282',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  onboardingUploadTextSelected: {
    color: '#fc4c02',
    fontWeight: '500',
  },
  onboardingSubmit: {
    marginTop: 8,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 11,
    marginBottom: 7,
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
  profileRoot: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  profileTopbar: {
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
  profileBack: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeading: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 32,
  },
  profileContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  profileVerifiedBanner: {
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: 'rgba(252,76,2,0.2)',
    backgroundColor: 'rgba(252,76,2,0.05)',
    paddingHorizontal: 17,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileVerifiedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(252,76,2,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileVerifiedTextWrap: {
    flex: 1,
  },
  profileVerifiedTitle: {
    color: '#101828',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  profileVerifiedSub: {
    color: '#4a5565',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  profileCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    overflow: 'hidden',
  },
  profileCardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.162,
    borderBottomColor: '#f3f4f6',
  },
  profileCardTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  profileRowsWrap: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileRowLabel: {
    color: '#4a5565',
    fontSize: 13,
    lineHeight: 19.5,
  },
  profileRowValue: {
    color: '#101828',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'right',
  },
  profileInfoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: 'rgba(252,76,2,0.2)',
    backgroundColor: 'rgba(252,76,2,0.05)',
    paddingHorizontal: 17,
    paddingVertical: 17,
  },
  profileInfoText: {
    flex: 1,
    color: '#364153',
    fontSize: 12,
    lineHeight: 19.5,
  },
  profileToastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    alignItems: 'center',
  },
  profileToast: {
    minWidth: 240,
    borderRadius: 8,
    borderWidth: 1.162,
    borderColor: '#bffcd9',
    backgroundColor: '#ecfdf3',
    paddingHorizontal: 13,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  profileToastIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#008a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileToastText: {
    color: '#008a2e',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19.5,
  },
  profileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  profileModalScroll: {
    width: '100%',
    maxHeight: '90%',
  },
  profileModalScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  profileModal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 25 },
    elevation: 8,
  },
  profileModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1.162,
    borderBottomColor: '#f3f4f6',
  },
  profileModalTitle: {
    flex: 1,
    color: '#101828',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
  profileModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileModalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  modalField: {
    gap: 8,
  },
  modalFieldLabel: {
    color: '#364153',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19.5,
  },
  modalFieldInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.162,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    color: '#0a0a0a',
    fontSize: 14,
  },
  modalUploadField: {
    gap: 8,
  },
  modalUploadLabel: {
    color: '#364153',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19.5,
  },
  modalUpload: {
    height: 136,
    borderRadius: 12,
    borderWidth: 1.162,
    borderColor: '#d1d5dc',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  modalUploadText: {
    color: '#364153',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  modalUploadLink: {
    color: '#fc4c02',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  modalUploadHint: {
    color: '#6a7282',
    fontSize: 12,
    lineHeight: 18,
  },
  modalNotice: {
    borderRadius: 12,
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  modalNoticeText: {
    color: '#364153',
    fontSize: 11,
    lineHeight: 18,
  },
  profileModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  profileModalCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileModalCancelText: {
    color: '#364153',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  profileModalSubmit: {
    flex: 1,
  },
});
