import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { GradientButton } from '../components/GradientButton';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  UploadArrowIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { StationItem, type KycUploadFile } from '../services/ownerApi';

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  autoCapitalize,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: 'none' | 'characters' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

function UploadCard({
  label,
  hint,
  fileName,
  onPress,
  iconVariant = 'camera',
  height = 160,
}: {
  label: string;
  hint: string;
  fileName?: string;
  onPress: () => void;
  iconVariant?: 'camera' | 'upload';
  height?: number;
}) {
  const selected = Boolean(fileName);
  const iconColor = selected ? '#fc4c02' : '#64748b';
  return (
    <View style={styles.uploadSection}>
      <Text style={styles.uploadSectionLabel}>{label}</Text>
      <Pressable
        style={[styles.uploadArea, { height }, selected && styles.uploadAreaSelected]}
        onPress={onPress}
      >
        {iconVariant === 'upload' ? (
          <UploadArrowIcon size={32} color={iconColor} />
        ) : (
          <CameraIcon size={40} color={iconColor} />
        )}
        <Text
          style={[styles.uploadAreaText, selected && styles.uploadAreaTextSelected]}
          numberOfLines={1}
        >
          {fileName || hint}
        </Text>
      </Pressable>
    </View>
  );
}

function StationDropdown({
  stations,
  selectedId,
  onSelect,
}: {
  stations: StationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = stations.find((s) => s._id === selectedId);

  return (
    <View>
      <Pressable style={styles.dropdown} onPress={() => setOpen((v) => !v)}>
        <Text
          style={[
            styles.dropdownText,
            !selected && styles.dropdownPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selected?.name || 'Select Station'}
        </Text>
        <ChevronDownIcon size={20} color="#64748b" />
      </Pressable>
      {open ? (
        <View style={styles.dropdownList}>
          {stations.length === 0 ? (
            <Text style={styles.dropdownEmpty}>No stations available yet</Text>
          ) : (
            stations.map((station) => {
              const isSelected = station._id === selectedId;
              return (
                <Pressable
                  key={station._id}
                  style={[styles.dropdownOption, isSelected && styles.dropdownOptionActive]}
                  onPress={() => {
                    onSelect(station._id);
                    setOpen(false);
                  }}
                >
                  <View style={styles.dropdownOptionTextWrap}>
                    <Text style={styles.dropdownOptionTitle}>
                      {station.name || 'Unnamed station'}
                    </Text>
                    {station.address || station.city ? (
                      <Text style={styles.dropdownOptionMeta}>
                        {station.address || station.city}
                      </Text>
                    ) : null}
                  </View>
                  {isSelected ? <CheckIcon size={16} color="#fc4c02" /> : null}
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}
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

  const canContinueStep1 =
    form.modelName.trim().length > 0 &&
    form.registrationNumber.trim().length > 0 &&
    form.chassisNumber.trim().length > 0;
  const canContinueStep2 = Boolean(frontPhoto && sidePhoto);
  const canContinueStep3 = Boolean(rcDocument && insuranceDocument);

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>Add New Vehicle</Text>
        <Text style={styles.stepLabel}>Step {step} of 4</Text>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 ? (
            <>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
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
                  onChangeText={(value) => onChangeForm({ registrationNumber: value.toUpperCase() })}
                  autoCapitalize="characters"
                />
                <Field
                  label="Chassis Number"
                  placeholder="Enter chassis number"
                  value={form.chassisNumber}
                  onChangeText={(value) => onChangeForm({ chassisNumber: value })}
                />
              </View>

              <GradientButton
                label="Continue"
                onPress={onNext}
                disabled={!canContinueStep1}
                height={48}
                radius={12}
                rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
                style={styles.cta}
              />
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Text style={styles.sectionTitle}>Vehicle Photos</Text>
              <UploadCard
                label="Front View"
                hint="Upload Front Photo"
                fileName={frontPhoto?.name}
                onPress={onPickFrontPhoto}
              />
              <UploadCard
                label="Side View"
                hint="Upload Side Photo"
                fileName={sidePhoto?.name}
                onPress={onPickSidePhoto}
              />
              <GradientButton
                label="Continue"
                onPress={onNext}
                disabled={!canContinueStep2}
                height={48}
                radius={12}
                rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
                style={styles.cta}
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Text style={styles.sectionTitle}>Documents</Text>
              <UploadCard
                label="RC (Registration Certificate)"
                hint="Upload RC Document"
                fileName={rcDocument?.name}
                onPress={onPickRcDocument}
                iconVariant="upload"
                height={128}
              />
              <UploadCard
                label="Insurance"
                hint="Upload Insurance"
                fileName={insuranceDocument?.name}
                onPress={onPickInsuranceDocument}
                iconVariant="upload"
                height={128}
              />
              <GradientButton
                label="Continue"
                onPress={onNext}
                disabled={!canContinueStep3}
                height={48}
                radius={12}
                rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
                style={styles.cta}
              />
            </>
          ) : null}

          {step === 4 ? (
            <>
              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Assign Station</Text>
                <View style={styles.field}>
                  <Text style={styles.label}>Select Station</Text>
                  <StationDropdown
                    stations={stations}
                    selectedId={form.stationId}
                    onSelect={(id) => onChangeForm({ stationId: id })}
                  />
                </View>

                <View style={styles.noteCard}>
                  <Text style={styles.noteTitle}>📍 Note</Text>
                  <Text style={styles.noteText}>
                    Your vehicle will be available for rides at this station once approved by admin.
                  </Text>
                </View>
              </View>

              <GradientButton
                label={loading ? 'Submitting...' : 'Submit for Approval'}
                onPress={onNext}
                disabled={loading || !isReadyToSubmit}
                height={48}
                radius={12}
                rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
                style={styles.cta}
              />
              {!isReadyToSubmit ? (
                <Text style={styles.submitNote}>
                  Upload all files and choose a station to continue.
                </Text>
              ) : null}
              {loading ? (
                <View style={styles.toast}>
                  <View style={styles.toastIconWrap}>
                    <CheckIcon size={12} color="#ffffff" />
                  </View>
                  <Text style={styles.toastText}>Request sent for admin approval.</Text>
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomTabs active="home" onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  topbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.26)',
    gap: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 28,
  },
  stepLabel: {
    color: '#101828',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
  },
  progressWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fc4c02',
    borderRadius: 999,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 0,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  input: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: '#0f172a',
    fontSize: 16,
  },
  uploadSection: {
    gap: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  uploadSectionLabel: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    marginBottom: 8,
  },
  uploadArea: {
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadAreaSelected: {
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(255,244,239,0.5)',
  },
  uploadAreaText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  uploadAreaTextSelected: {
    color: '#fc4c02',
  },
  cta: {
    marginTop: 0,
  },
  dropdown: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(248,250,252,0.5)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    flex: 1,
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 20,
    marginRight: 8,
  },
  dropdownPlaceholder: {
    color: '#64748b',
  },
  dropdownList: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownOptionActive: {
    backgroundColor: 'rgba(255,244,239,0.8)',
  },
  dropdownOptionTextWrap: { flex: 1, paddingRight: 8 },
  dropdownOptionTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  dropdownOptionMeta: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  dropdownEmpty: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 14,
  },
  noteCard: {
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    paddingHorizontal: 17,
    paddingVertical: 17,
    gap: 8,
  },
  noteTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
  noteText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  submitNote: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  toast: {
    marginTop: 8,
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
  toastIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#008a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#008a2e',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
});
