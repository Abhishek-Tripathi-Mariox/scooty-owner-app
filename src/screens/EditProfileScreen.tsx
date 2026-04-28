import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { GradientButton } from '../components/GradientButton';
import {
  ArrowLeftIcon,
  CameraIcon,
  ChevronDownIcon,
} from '../components/OwnerIcons';
import { Owner, type KycUploadFile } from '../services/ownerApi';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

function FloatingField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        editable={editable}
        style={[styles.input, !editable && styles.inputDisabled]}
      />
    </View>
  );
}

export function EditProfileScreen({
  onBack,
  owner,
  form,
  onChangeForm,
  profilePhoto,
  onPickProfilePhoto,
  onSubmit,
  loading = false,
}: {
  onBack: () => void;
  owner?: Owner | null;
  form: {
    fullName: string;
    email: string;
    mobile: string;
    address: string;
    city?: string;
    state: string;
    pincode: string;
  };
  onChangeForm: (patch: Partial<{ fullName: string; email: string; mobile: string; address: string; city: string; state: string; pincode: string }>) => void;
  profilePhoto?: KycUploadFile | null;
  onPickProfilePhoto: () => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  const initials = (form.fullName || owner?.name || 'Owner')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
  const profilePhotoUrl = owner?.profilePhotoUrl || '';
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  const filteredStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes(stateSearch.trim().toLowerCase()),
  );

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.heading}>Profile</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.avatarWrap} onPress={onPickProfilePhoto}>
            <View style={styles.avatar}>
              {profilePhoto?.uri || profilePhotoUrl ? (
                <Image
                  source={{ uri: profilePhoto?.uri || profilePhotoUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View style={styles.avatarOverlay} pointerEvents="none">
              <CameraIcon size={32} color="#ffffff" />
            </View>
          </Pressable>

          <View style={styles.formCard}>
            <FloatingField
              label="Full Name"
              value={form.fullName}
              onChangeText={(v) => onChangeForm({ fullName: v })}
              placeholder="Enter full name"
            />
            <FloatingField
              label="Email Address"
              value={form.email}
              onChangeText={(v) => onChangeForm({ email: v })}
              placeholder="your@email.com"
              keyboardType="email-address"
            />
            <FloatingField
              label="Phone Number"
              value={form.mobile ? `+91 ${form.mobile}` : ''}
              onChangeText={() => undefined}
              placeholder="+91 98765 43210"
              editable={false}
            />
            <FloatingField
              label="Current Address"
              value={form.address}
              onChangeText={(v) => onChangeForm({ address: v })}
              placeholder="Enter current address"
            />
            <FloatingField
              label="City"
              value={form.city || ''}
              onChangeText={(v) => onChangeForm({ city: v })}
              placeholder="Enter city"
            />
            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <FloatingField
                  label="Zip Code"
                  value={form.pincode}
                  onChangeText={(v) => onChangeForm({ pincode: v })}
                  placeholder="203207"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.rowHalf}>
                <View style={styles.field}>
                  <View style={styles.fieldLabelWrap}>
                    <Text style={styles.fieldLabel}>State</Text>
                  </View>
                  <Pressable
                    style={styles.selector}
                    onPress={() => {
                      setStateSearch('');
                      setStatePickerOpen(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        !form.state && styles.selectorPlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {form.state || 'Select state'}
                    </Text>
                    <ChevronDownIcon size={16} color="#64748b" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <GradientButton
            label={loading ? 'Saving...' : 'Save Changes'}
            onPress={onSubmit}
            disabled={loading}
            height={56}
            radius={12}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={statePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStatePickerOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalBackdropTouchable}
            onPress={() => setStatePickerOpen(false)}
          />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select State</Text>
            <TextInput
              value={stateSearch}
              onChangeText={setStateSearch}
              placeholder="Search state"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={styles.stateList}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.stateRow,
                    item === form.state && styles.stateRowSelected,
                  ]}
                  onPress={() => {
                    onChangeForm({ state: item });
                    setStatePickerOpen(false);
                    setStateSearch('');
                  }}
                >
                  <Text style={styles.stateName}>{item}</Text>
                  {item === form.state ? <Text style={styles.stateCheck}>✓</Text> : null}
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No state found</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'stretch',
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignSelf: 'center',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fc4c02',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,22,22,0.55)',
  },
  formCard: {
    gap: 24,
    marginBottom: 24,
  },
  field: {
    position: 'relative',
  },
  fieldLabelWrap: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#fbe9e6',
    paddingHorizontal: 8,
    zIndex: 2,
  },
  fieldLabel: {
    color: 'rgba(27,29,33,0.5)',
    fontSize: 12,
    lineHeight: 16,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(27,29,33,0.1)',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    color: '#1b1d21',
    fontSize: 14,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  selector: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(27,29,33,0.1)',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    flex: 1,
    color: '#1b1d21',
    fontSize: 14,
    marginRight: 8,
  },
  selectorPlaceholder: {
    color: '#9ca3af',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowHalf: {
    flex: 1,
  },
  saveButton: {
    alignSelf: 'stretch',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBackdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  modalTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    color: '#0f172a',
    fontSize: 14,
    marginBottom: 8,
  },
  stateList: {
    maxHeight: 320,
  },
  stateRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateRowSelected: {
    backgroundColor: 'rgba(252,76,2,0.1)',
  },
  stateName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
  },
  stateCheck: {
    color: '#fc4c02',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
  },
});
