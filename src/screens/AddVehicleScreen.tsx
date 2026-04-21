import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { PageFrame } from '../components/PageFrame';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SPACING } from '../constants/theme';
import { StationItem, type KycUploadFile } from '../services/ownerApi';

function Field({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
    </View>
  );
}

export function AddVehicleScreen({
  step,
  onBack,
  onNext,
  form,
  onChangeForm,
  stations = [],
  frontPhoto,
  sidePhoto,
  rcDocument,
  insuranceDocument,
  onPickFrontPhoto,
  onPickSidePhoto,
  onPickRcDocument,
  onPickInsuranceDocument,
  loading = false,
  onTabPress,
}: {
  step: 1 | 2 | 3 | 4;
  onBack: () => void;
  onNext: () => void;
  form: {
    modelName: string;
    registrationNumber: string;
    chassisNumber: string;
    stationId: string;
  };
  onChangeForm: (patch: Partial<{ modelName: string; registrationNumber: string; chassisNumber: string; stationId: string }>) => void;
  stations?: StationItem[];
  frontPhoto?: KycUploadFile | null;
  sidePhoto?: KycUploadFile | null;
  rcDocument?: KycUploadFile | null;
  insuranceDocument?: KycUploadFile | null;
  onPickFrontPhoto: () => void;
  onPickSidePhoto: () => void;
  onPickRcDocument: () => void;
  onPickInsuranceDocument: () => void;
  loading?: boolean;
  onTabPress: (tab: TabKey) => void;
}) {
  const progress = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;
  const isReadyToSubmit = Boolean(
    form.stationId &&
      frontPhoto &&
      sidePhoto &&
      rcDocument &&
      insuranceDocument,
  );

  return (
    <View style={styles.root}>
      <PageFrame title="Add New Vehicle" subtitle={`Step ${step} of 4`} onBack={onBack} scroll={false}>
        <View style={styles.body}>
          <ProgressBar progress={progress} />

          {step === 1 ? (
            <ScrollView
              contentContainerStyle={styles.section}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets
            >
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              <View style={styles.card}>
                <Field
                  label="Model Name"
                  placeholder="e.g., Ola S1 Pro"
                  value={form.modelName}
                  onChangeText={(value) => onChangeForm({ modelName: value })}
                />
                <Field
                  label="Registration Number"
                  placeholder="e.g., KA-01-AB-1234"
                  value={form.registrationNumber}
                  onChangeText={(value) => onChangeForm({ registrationNumber: value })}
                />
                <Field
                  label="Chassis Number"
                  placeholder="Enter chassis number"
                  value={form.chassisNumber}
                  onChangeText={(value) => onChangeForm({ chassisNumber: value })}
                />
              </View>
              <Pressable style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>Continue  →</Text>
              </Pressable>
            </ScrollView>
          ) : null}

          {step === 2 ? (
            <ScrollView
              contentContainerStyle={styles.section}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets
            >
              <Text style={styles.sectionTitle}>Vehicle Photos</Text>
              <UploadTile title="Front View" icon="📷" hint="Upload Front Photo" fileName={frontPhoto?.name} onPress={onPickFrontPhoto} />
              <UploadTile title="Side View" icon="📷" hint="Upload Side Photo" fileName={sidePhoto?.name} onPress={onPickSidePhoto} />
              <Pressable style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>Continue  →</Text>
              </Pressable>
            </ScrollView>
          ) : null}

          {step === 3 ? (
            <ScrollView
              contentContainerStyle={styles.section}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets
            >
              <Text style={styles.sectionTitle}>Documents</Text>
              <UploadTile title="RC (Registration Certificate)" icon="⇪" hint="Upload RC Document" fileName={rcDocument?.name} onPress={onPickRcDocument} />
              <UploadTile title="Insurance" icon="⇪" hint="Upload Insurance" fileName={insuranceDocument?.name} onPress={onPickInsuranceDocument} />
              <Pressable style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>Continue  →</Text>
              </Pressable>
            </ScrollView>
          ) : null}

          {step === 4 ? (
            <ScrollView
              contentContainerStyle={styles.section}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets
            >
              <Text style={styles.sectionTitle}>Assign Station</Text>
              <View style={styles.card}>
                <Text style={styles.label}>Select Station</Text>
                {stations.length ? (
                  <View style={styles.stationList}>
                    {stations.map((station) => {
                      const selected = form.stationId === station._id;
                      return (
                        <Pressable
                          key={station._id}
                          style={[styles.stationItem, selected && styles.stationItemSelected]}
                          onPress={() => onChangeForm({ stationId: station._id })}
                        >
                          <View style={styles.stationItemTextWrap}>
                            <Text style={styles.stationName}>{station.name || 'Unnamed station'}</Text>
                            <Text style={styles.stationMeta}>
                              {station.address || station.city || station._id}
                            </Text>
                          </View>
                          <Text style={[styles.stationCheck, selected && styles.stationCheckSelected]}>
                            {selected ? 'Selected' : 'Tap'}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyStationState}>
                    <Text style={styles.emptyStationTitle}>No stations available yet</Text>
                    <Text style={styles.emptyStationText}>
                      Please wait for stations to load, or add one from the admin side.
                    </Text>
                  </View>
                )}
                <View style={styles.noteBox}>
                  <Text style={styles.noteTitle}>📍 Note</Text>
                  <Text style={styles.noteText}>
                    Your vehicle will be available for rides at the selected station once approved by admin.
                  </Text>
                </View>
              </View>

              <Pressable style={[styles.button, (!isReadyToSubmit || loading) && styles.buttonDisabled]} onPress={onNext} disabled={loading || !isReadyToSubmit}>
                <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit for Approval  →'}</Text>
              </Pressable>
              {!isReadyToSubmit ? (
                <Text style={styles.submitNote}>Upload all files and choose a station to continue.</Text>
              ) : null}

              <View style={styles.toast}>
                <Text style={styles.toastDot}>●</Text>
                <Text style={styles.toastText}>Request sent for admin approval</Text>
              </View>
            </ScrollView>
          ) : null}
        </View>
      </PageFrame>
      <BottomTabs active="home" onTabPress={onTabPress} />
    </View>
  );
}

function UploadTile({
  title,
  hint,
  icon,
  fileName,
  onPress,
}: {
  title: string;
  hint: string;
  icon: string;
  fileName?: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.uploadWrap}>
      <Text style={styles.uploadLabel}>{title}</Text>
      <Pressable style={[styles.uploadTile, fileName ? styles.uploadTileSelected : null]} onPress={onPress}>
        <Text style={styles.uploadIcon}>{fileName ? '✓' : icon}</Text>
        <View style={styles.uploadCopy}>
          <Text style={styles.uploadHint}>{fileName || hint}</Text>
          {fileName ? <Text style={styles.uploadMeta}>Tap to replace</Text> : null}
        </View>
        <Text style={styles.uploadAction}>{fileName ? 'Uploaded' : 'Upload'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, paddingTop: 12 },
  section: { paddingBottom: 18 },
  sectionTitle: { fontSize: 18, color: COLORS.textPrimary, fontWeight: '900', marginBottom: 12 },
  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  field: { marginBottom: 10 },
  label: { marginBottom: 6, color: COLORS.textPrimary, fontSize: 12, fontWeight: '700' },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
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
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  uploadWrap: { marginBottom: 12 },
  uploadLabel: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '700', marginBottom: 6 },
  uploadTile: {
    minHeight: 104,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadTileSelected: {
    borderColor: '#e0b8a8',
    backgroundColor: 'rgba(255,247,243,0.9)',
  },
  uploadIcon: { fontSize: 28, color: '#94a3b8', marginRight: 12, width: 28, textAlign: 'center' },
  uploadCopy: { flex: 1 },
  uploadHint: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '700' },
  uploadMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  uploadAction: { fontSize: 12, color: COLORS.button, fontWeight: '800' },
  stationList: { marginTop: 2 },
  stationItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stationItemSelected: {
    borderColor: '#e0b8a8',
    backgroundColor: 'rgba(255,247,243,0.92)',
  },
  stationItemTextWrap: { flex: 1, paddingRight: 10 },
  stationName: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
  stationMeta: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3, lineHeight: 15 },
  stationCheck: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '800' },
  stationCheckSelected: { color: COLORS.button },
  emptyStationState: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    padding: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  emptyStationTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800', marginBottom: 4 },
  emptyStationText: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 15 },
  noteBox: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,244,239,0.85)',
    borderWidth: 1,
    borderColor: '#ffd7c8',
    padding: 12,
  },
  noteTitle: { color: COLORS.button, fontWeight: '800', fontSize: 12, marginBottom: 6 },
  noteText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
  toast: {
    marginTop: 14,
    borderRadius: 8,
    backgroundColor: '#e8fff0',
    borderWidth: 1,
    borderColor: '#bff2cf',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastDot: { color: '#16a34a', marginRight: 8 },
  toastText: { color: '#166534', fontSize: 12, fontWeight: '700' },
  submitNote: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
});
