import { useState } from 'react';
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
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
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

function IndianFlag({ size = 22 }: { size?: number }) {
  const stripeH = size / 3;
  const cx = size / 2;
  const cy = size / 2;
  const chakraR = stripeH * 0.4;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={stripeH} fill="#FF9933" />
      <Rect x={0} y={stripeH} width={size} height={stripeH} fill="#FFFFFF" />
      <Rect x={0} y={stripeH * 2} width={size} height={stripeH} fill="#138808" />
      <Circle cx={cx} cy={cy} r={chakraR} stroke="#000080" strokeWidth={1} fill="none" />
      <Line x1={cx - chakraR} y1={cy} x2={cx + chakraR} y2={cy} stroke="#000080" strokeWidth={0.6} />
      <Line x1={cx} y1={cy - chakraR} x2={cx} y2={cy + chakraR} stroke="#000080" strokeWidth={0.6} />
      <Line x1={cx - chakraR * 0.7} y1={cy - chakraR * 0.7} x2={cx + chakraR * 0.7} y2={cy + chakraR * 0.7} stroke="#000080" strokeWidth={0.5} />
      <Line x1={cx - chakraR * 0.7} y1={cy + chakraR * 0.7} x2={cx + chakraR * 0.7} y2={cy - chakraR * 0.7} stroke="#000080" strokeWidth={0.5} />
    </Svg>
  );
}

function VerifiedCheck({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} fill="#0f172a" />
      <Path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FloatingField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  editable = true,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelChip}>
        <Text style={styles.labelChipText}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(27,29,33,0.4)"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        style={styles.input}
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
  onChangeForm: (
    patch: Partial<{
      fullName: string;
      email: string;
      mobile: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    }>,
  ) => void;
  profilePhoto?: KycUploadFile | null;
  onPickProfilePhoto: () => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  const profilePhotoUrl = owner?.profilePhotoUrl || '';
  const hasPhoto = Boolean(profilePhoto?.uri || profilePhotoUrl);
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
              {hasPhoto ? (
                <Image
                  source={{ uri: profilePhoto?.uri || profilePhotoUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : null}
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
              autoCapitalize="none"
            />

            <View style={styles.field}>
              <View style={styles.labelChip}>
                <Text style={styles.labelChipText}>Phone Number</Text>
              </View>
              <View style={[styles.input, styles.phoneRow]}>
                <View style={styles.flagCircle}>
                  <IndianFlag size={22} />
                </View>
                <Text style={styles.phoneText} numberOfLines={1}>
                  {form.mobile ? `+91 ${form.mobile}` : '+91 98765 43210'}
                </Text>
                <VerifiedCheck size={20} />
              </View>
            </View>

            <FloatingField
              label="Current Address"
              value={form.address}
              onChangeText={(v) => onChangeForm({ address: v })}
              placeholder="Enter current address"
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
                  <View style={styles.labelChip}>
                    <Text style={styles.labelChipText}>State</Text>
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
                  style={styles.stateItem}
                  onPress={() => {
                    onChangeForm({ state: item });
                    setStatePickerOpen(false);
                  }}
                >
                  <Text style={styles.stateItemText}>{item}</Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No state matches your search.</Text>
              }
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
    paddingBottom: 32,
  },
  avatarWrap: {
    width: 104,
    height: 104,
    borderRadius: 36,
    alignSelf: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 36,
    backgroundColor: '#3a2a22',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,22,22,0.7)',
  },
  formCard: {
    gap: 24,
    marginBottom: 24,
  },
  field: {
    position: 'relative',
  },
  labelChip: {
    position: 'absolute',
    top: -8,
    left: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fbe9e6',
    zIndex: 2,
  },
  labelChipText: {
    color: 'rgba(27,29,33,0.4)',
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  flagCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneText: {
    flex: 1,
    color: '#1b1d21',
    fontSize: 14,
  },
  selector: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(27,29,33,0.1)',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
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
    color: 'rgba(27,29,33,0.4)',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowHalf: {
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '88%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
  },
  modalTitle: {
    color: '#1b1d21',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    color: '#1b1d21',
    fontSize: 14,
    marginBottom: 12,
  },
  stateList: {
    maxHeight: 320,
  },
  stateItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stateItemText: {
    color: '#1b1d21',
    fontSize: 15,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
