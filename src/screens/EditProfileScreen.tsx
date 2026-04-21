import React from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
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

function Field({
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
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a79ca3"
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
  const [statePickerOpen, setStatePickerOpen] = React.useState(false);
  const [stateSearch, setStateSearch] = React.useState('');

  const filteredStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes(stateSearch.trim().toLowerCase()),
  );

  return (
    <PageFrame title="Profile" onBack={onBack} scroll>
      <View style={styles.hero}>
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
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraIcon}>▣</Text>
          </View>
        </Pressable>
        <Text style={styles.heroTitle}>{owner?.name || form.fullName || 'Vehicle Owner'}</Text>
        <Text style={styles.heroSubtitle}>{owner?.companyName || 'Verified Owner'}</Text>
      </View>

      <View style={styles.formCard}>
        <Field
          label="Full Name"
          value={form.fullName}
          onChangeText={(value) => onChangeForm({ fullName: value })}
          placeholder="Enter full name"
        />
        <Field
          label="Email Address"
          value={form.email}
          onChangeText={(value) => onChangeForm({ email: value })}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
        <Field
          label="Phone Number"
          value={form.mobile}
          onChangeText={() => undefined}
          placeholder="Phone number"
          editable={false}
        />
        <Field
          label="Current Address"
          value={form.address}
          onChangeText={(value) => onChangeForm({ address: value })}
          placeholder="Enter current address"
        />
        <View style={styles.row}>
          <View style={styles.rowHalf}>
            <Field
              label="Zip Code"
              value={form.pincode}
              onChangeText={(value) => onChangeForm({ pincode: value })}
              placeholder="Pin code"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.rowHalf}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>State</Text>
              <Pressable
                style={styles.selector}
                onPress={() => {
                  setStateSearch('');
                  setStatePickerOpen(true);
                }}
              >
                <Text style={[styles.selectorText, !form.state && styles.selectorPlaceholder]}>
                  {form.state || 'Select state'}
                </Text>
                <Text style={styles.selectorArrow}>⌄</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={onSubmit} disabled={loading}>
          <Text style={styles.saveText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
      </View>

      <Modal visible={statePickerOpen} transparent animationType="fade" onRequestClose={() => setStatePickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalBackdropTouchable} onPress={() => setStatePickerOpen(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select State</Text>
            <TextInput
              value={stateSearch}
              onChangeText={setStateSearch}
              placeholder="Search state"
              placeholderTextColor="#a79ca3"
              style={styles.searchInput}
            />
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={styles.stateList}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.stateRow, item === form.state && styles.stateRowSelected]}
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
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 22,
    backgroundColor: COLORS.button,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 102,
    height: 102,
    borderRadius: 26,
    backgroundColor: '#6b3a31',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { color: COLORS.button, fontSize: 15, fontWeight: '900' },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  heroSubtitle: { color: 'rgba(255,255,255,0.92)', marginTop: 4, fontSize: 12 },
  formCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
  },
  field: { marginBottom: 12 },
  fieldLabel: { color: '#b29aa2', fontSize: 11, marginBottom: 5 },
  selector: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    flex: 1,
    paddingRight: 8,
  },
  selectorPlaceholder: {
    color: '#a79ca3',
  },
  selectorArrow: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  inputDisabled: {
    opacity: 0.76,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowHalf: { flex: 1 },
  saveButton: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.38)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBackdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    maxHeight: '78%',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 10,
  },
  stateList: {
    maxHeight: 420,
  },
  stateRow: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#faf7f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateRowSelected: {
    borderColor: COLORS.button,
    backgroundColor: 'rgba(255,100,28,0.08)',
  },
  stateName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  stateCheck: {
    color: COLORS.button,
    fontSize: 14,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    paddingVertical: 12,
    textAlign: 'center',
  },
});
