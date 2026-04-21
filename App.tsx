import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, NativeModules, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import DocumentPicker, {
  isCancel as isDocumentPickerCancel,
  types as DocumentPickerTypes,
} from 'react-native-document-picker';
import { compressImage, checkFileSizeLimit } from './src/utils/image-compression';
import { LoginScreen } from './src/screens/LoginScreen';
import { OtpScreen } from './src/screens/OtpScreen';
import { AuthStep, OTP_LENGTH } from './src/constants/auth';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { KycScreen } from './src/screens/KycScreen';
import { PendingApprovalScreen } from './src/screens/PendingApprovalScreen';
import { AccountActivatedScreen } from './src/screens/AccountActivatedScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { RequestPayoutScreen } from './src/screens/RequestPayoutScreen';
import { EarningsScreen } from './src/screens/EarningsScreen';
import { AddVehicleScreen } from './src/screens/AddVehicleScreen';
import { VehicleListScreen } from './src/screens/VehicleListScreen';
import { VehicleDetailsScreen } from './src/screens/VehicleDetailsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { SupportScreen } from './src/screens/SupportScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { DocumentsScreen } from './src/screens/DocumentsScreen';
import { BankDetailsScreen } from './src/screens/BankDetailsScreen';
import { MapViewScreen } from './src/screens/MapViewScreen';
import { NoticeModal } from './src/components/NoticeModal';
import type { TabKey } from './src/components/BottomTabs';
import {
  Bank,
  Dashboard,
  EarningsResponse,
  NotificationItem,
  Owner,
  OwnerSettings,
  PayoutItem,
  StationItem,
  SupportFaq,
  SupportTicket,
  VehicleItem,
  type KycUploadFile,
  type KycUploadFiles,
  type OwnerKyc,
  type VehicleUploadFiles,
  OWNER_API_BASE_URL,
  ownerApi,
  ownerApiErrorMessage,
} from './src/services/ownerApi';
import { FONTS } from './src/constants/fonts';

type AppStep =
  | AuthStep
  | 'register'
  | 'kyc'
  | 'pending-approval'
  | 'activated'
  | 'dashboard'
  | 'notifications'
  | 'request-payout'
  | 'earnings'
  | 'add-vehicle-1'
  | 'add-vehicle-2'
  | 'add-vehicle-3'
  | 'add-vehicle-4'
  | 'vehicles'
  | 'vehicle-details'
  | 'vehicle-map'
  | 'vehicle-remove'
  | 'profile'
  | 'profile-edit'
  | 'settings'
  | 'support'
  | 'documents'
  | 'bank-details'
  | 'bank-details-onboarding'
  | 'bank-details-edit';

type EarningsRange = 'today' | 'week' | 'month';

type NoticeState = {
  title: string;
  message?: string;
  actionLabel?: string;
} | null;

const DEFAULT_BANK_FORM = {
  accountHolderName: '',
  accountNumber: '',
  bankName: '',
  ifsc: '',
  upiId: '',
  bankFile: null as KycUploadFiles[keyof KycUploadFiles] | null,
};

const DEFAULT_VEHICLE_FORM = {
  modelName: '',
  registrationNumber: '',
  chassisNumber: '',
  stationId: '',
};

const DEFAULT_PROFILE_PHOTO = null as KycUploadFile | null;

const DEFAULT_VEHICLE_FILES: VehicleUploadFiles = {};

const DEFAULT_SETTINGS: OwnerSettings = {
  notifications: {
    rideUpdates: true,
    earnings: true,
    payout: true,
    promotions: false,
    maintenance: true,
  },
  language: 'en',
};

const DEFAULT_KYC_FILES: KycUploadFiles = {};
const AUTH_TOKEN_KEY = 'scooty_rental_owner_auth_token';
const OwnerAuthStorage = NativeModules.OwnerAuthStorage as
  | {
      setItem?: (key: string, value: string) => Promise<void>;
      getItem?: (key: string) => Promise<string | null>;
      removeItem?: (key: string) => Promise<void>;
    }
  | undefined;

const inferMimeType = (fileName: string, fallback: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'pdf') return 'application/pdf';
  return fallback;
};

const resolveMimeType = (mimeType: string | null | undefined, fileName: string, fallback: string) => {
  const normalized = mimeType?.trim().toLowerCase();
  if (normalized && normalized !== 'application/octet-stream') {
    if (normalized === 'image/jpg') return 'image/jpeg';
    return normalized;
  }
  return inferMimeType(fileName, fallback);
};

const OWNER_PUBLIC_BASE_URL = OWNER_API_BASE_URL.replace(/\/scooty\/v1\/api\/?$/, '');

const normalizeDocumentUrl = (url?: string | null) => {
  if (!url) return null;

  const trimmed = url.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return encodeURI(trimmed);
  }

  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return encodeURI(`${OWNER_PUBLIC_BASE_URL}${path}`);
};

const createUploadFile = (
  response: { name?: string | null; uri?: string | null; fileCopyUri?: string | null; type?: string | null; size?: number | null },
  fallbackName: string,
  fallbackType: string,
): KycUploadFile | null => {
  const uri = response.fileCopyUri ?? response.uri ?? undefined;
  if (!uri) return null;

  const fileName = response.name || fallbackName;
  return {
    uri,
    name: fileName,
    type: resolveMimeType(response.type, fileName, fallbackType),
    size: response.size,
  };
};

const resolveKycStep = (kycStatus?: string): AppStep => {
  if (kycStatus === 'APPROVED') return 'dashboard';
  if (kycStatus === 'PENDING' || kycStatus === 'REJECTED') return 'pending-approval';
  return 'register';
};

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEarningsRangeQuery = (range: EarningsRange) => {
  const now = new Date();
  const start = new Date(now);

  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    const day = start.getDay();
    const offset = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - offset);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return {
    from: toLocalDateKey(start),
    to: toLocalDateKey(now),
  };
};

export default function App() {
  const [step, setStep] = useState<AppStep>('login');
  const [token, setToken] = useState<string | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [kyc, setKyc] = useState<OwnerKyc | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [earnings, setEarnings] = useState<EarningsResponse | null>(null);
  const [earningsRange, setEarningsRange] = useState<EarningsRange>('today');
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [vehicleDetail, setVehicleDetail] = useState<VehicleItem | null>(null);
  const [faqs, setFaqs] = useState<SupportFaq[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<OwnerSettings>(DEFAULT_SETTINGS);
  const [stations, setStations] = useState<StationItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [otp, setOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [bankForm, setBankForm] = useState(DEFAULT_BANK_FORM);
  const [vehicleForm, setVehicleForm] = useState(DEFAULT_VEHICLE_FORM);
  const [vehicleFiles, setVehicleFiles] = useState<VehicleUploadFiles>(DEFAULT_VEHICLE_FILES);
  const [profilePhoto, setProfilePhoto] = useState<KycUploadFile | null>(DEFAULT_PROFILE_PHOTO);
  const [showBankEditModal, setShowBankEditModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [kycFiles, setKycFiles] = useState<KycUploadFiles>(DEFAULT_KYC_FILES);
  const [kycRequestDocument, setKycRequestDocument] = useState<keyof KycUploadFiles | null>(null);
  const [kycRequestOrigin, setKycRequestOrigin] = useState<'register' | 'documents' | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const normalizedPhone = useMemo(
    () => mobileNumber.replace(/\D/g, '').slice(0, 10),
    [mobileNumber],
  );

  const activeVehicle = useMemo(
    () => vehicleDetail || vehicles.find((vehicle) => vehicle._id === selectedVehicleId) || vehicles[0] || null,
    [selectedVehicleId, vehicleDetail, vehicles],
  );

  const handleBottomTabPress = (tab: TabKey) => {
    if (tab === 'home') setStep('dashboard');
    if (tab === 'scooty') setStep('vehicles');
    if (tab === 'earnings') setStep('earnings');
    if (tab === 'alerts') setStep('notifications');
    if (tab === 'profile') setStep('profile');
  };

  const showNotice = (nextNotice: Exclude<NoticeState, null>) => {
    setNotice(nextNotice);
  };

  const hideNotice = () => {
    setNotice(null);
  };

  const persistAuthToken = async (value: string) => {
    if (Platform.OS !== 'android' || !OwnerAuthStorage?.setItem) return;
    await OwnerAuthStorage.setItem(AUTH_TOKEN_KEY, value);
  };

  const clearAuthToken = async () => {
    if (Platform.OS !== 'android' || !OwnerAuthStorage?.removeItem) return;
    await OwnerAuthStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const syncProfileForm = (profile: Owner | null, profileBank: Bank | null) => {
    setOwner(profile);
    setBank(profileBank);
    setFullName(profile?.name || '');
    setEmail(profile?.email || '');
    setAddress(profile?.address || profile?.adress || '');
    setCity(profile?.city || '');
    setStateName(profile?.state || '');
    setPincode(profile?.pincode || '');
    setBankForm({
      accountHolderName: profileBank?.accountHolderName || '',
      accountNumber: profileBank?.accountNumber || '',
      bankName: profileBank?.bankName || '',
      ifsc: profileBank?.ifsc || '',
      upiId: profileBank?.upiId || '',
      bankFile: null,
    });
    if (profile?.settings) {
      setSettings({
        ...DEFAULT_SETTINGS,
        ...profile.settings,
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...(profile.settings.notifications || {}),
        },
      });
    }
  };

  const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

  const isValidIfsc = (value: string) => /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value.trim());

  const validateRegisterForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Enter your full name');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Enter your address');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Enter your city');
      return false;
    }
    if (normalizedPhone.length < 10) {
      Alert.alert('Enter a valid mobile number');
      return false;
    }
    if (!acceptedTerms) {
      Alert.alert('Please accept the terms and privacy policy');
      return false;
    }
    return true;
  };

  const validateProfileForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Enter your full name');
      return false;
    }
    if (!email.trim() || !isValidEmail(email)) {
      Alert.alert('Enter a valid email address');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Enter your address');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Enter your city');
      return false;
    }
    if (!stateName.trim()) {
      Alert.alert('Select your state');
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      Alert.alert('Enter a valid 6-digit pin code');
      return false;
    }
    return true;
  };

  const validateBankForm = () => {
    if (!bankForm.accountHolderName.trim()) {
      Alert.alert('Enter account holder name');
      return false;
    }
    if (!bankForm.bankName.trim()) {
      Alert.alert('Enter bank name');
      return false;
    }
    if (!bankForm.accountNumber.trim()) {
      Alert.alert('Enter account number');
      return false;
    }
    if (!/^\d{9,20}$/.test(bankForm.accountNumber.trim())) {
      Alert.alert('Enter a valid account number');
      return false;
    }
    if (!bankForm.ifsc.trim() || !isValidIfsc(bankForm.ifsc)) {
      Alert.alert('Enter a valid IFSC code');
      return false;
    }
    if (step === 'bank-details-onboarding' && !bankForm.bankFile) {
      Alert.alert('Upload passbook/cheque', 'Please upload your passbook or cheque before continuing.');
      return false;
    }
    return true;
  };

  const handleAddVehicleNext = async () => {
    if (step === 'add-vehicle-1') {
      if (!vehicleForm.modelName.trim() || !vehicleForm.registrationNumber.trim() || !vehicleForm.chassisNumber.trim()) {
        Alert.alert('Complete vehicle details', 'Please fill in model name, registration number, and chassis number before continuing.');
        return;
      }
      setStep('add-vehicle-2');
      return;
    }

    if (step === 'add-vehicle-2') {
      if (!vehicleFiles.frontPhoto || !vehicleFiles.sidePhoto) {
        Alert.alert('Upload vehicle photos', 'Please upload both front and side photos before continuing.');
        return;
      }
      setStep('add-vehicle-3');
      return;
    }

    if (step === 'add-vehicle-3') {
      if (!vehicleFiles.rcDocument || !vehicleFiles.insuranceDocument) {
        Alert.alert('Upload required documents', 'Please upload RC and insurance documents before continuing.');
        return;
      }
      setStep('add-vehicle-4');
      return;
    }

    if (step === 'add-vehicle-4') {
      if (!vehicleForm.stationId) {
        Alert.alert('Select a station', 'Please choose a station before submitting the vehicle.');
        return;
      }
      await handleVehicleSubmit();
    }
  };

  const handlePickProfilePhoto = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPickerTypes.images],
        copyTo: 'cachesDirectory',
        presentationStyle: 'fullScreen',
      });

      const file = createUploadFile(response, 'profile-photo.jpg', 'image/jpeg');
      if (!file) {
        Alert.alert('Could not select file', 'The selected file could not be loaded.');
        return;
      }
      setProfilePhoto(file);
    } catch (error) {
      if (isDocumentPickerCancel(error)) return;
      Alert.alert('Could not select file', ownerApiErrorMessage(error));
    }
  };

  const handleProfileSave = async () => {
    if (!token) return;
    if (!validateProfileForm()) return;
    setAuthBusy(true);
    try {
      const result = await ownerApi.updateProfile(token, {
        name: fullName,
        email,
        address,
        adress: address,
        city,
        state: stateName,
        pincode,
        companyName: owner?.companyName || 'MOVYRA Fleet',
        profilePhoto: profilePhoto || undefined,
      });
      syncProfileForm(result.owner, result.bank);
      setOwner(result.owner);
      setProfilePhoto(DEFAULT_PROFILE_PHOTO);
      await loadProfile(token);
      showNotice({
        title: 'Profile updated',
        message: 'Your changes have been saved successfully.',
      });
      setStep('profile');
    } catch (error) {
      Alert.alert('Could not save profile', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const setVehicleFile = async (
    field: keyof VehicleUploadFiles,
    options: {
      type: string[];
      fallbackName: string;
      fallbackType: string;
    },
  ) => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: options.type,
        copyTo: 'cachesDirectory',
        presentationStyle: 'fullScreen',
      });

      let file = createUploadFile(response, options.fallbackName, options.fallbackType);
      if (!file) {
        Alert.alert('Could not select file', 'The selected file could not be loaded.');
        return;
      }

      // Compress all images (photos and documents) to reduce payload
      const isImageFile = file.type?.includes('image') || 
                         file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
      
      if (isImageFile) {
        console.log(`[setVehicleFile] Compressing ${field}`);
        try {
          // Determine if this is a document photo or vehicle photo
          const isDocmentField = field === 'rcDocument' || field === 'insuranceDocument';
          const compressed = await compressImage(file.uri, file.name, isDocmentField ? 'document' : 'photo');
          file = {
            ...file,
            uri: compressed.uri,
            size: compressed.size,
          };
          console.log(`[setVehicleFile] Compressed ${field}: ${(compressed.size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.warn(`[setVehicleFile] Compression failed for ${field}, using original:`, error);
          // Continue with original file if compression fails
        }
      }

      // Check file size
      const sizeCheck = checkFileSizeLimit(file.size || 0, options.fallbackName);
      if (!sizeCheck.ok) {
        Alert.alert('File too large', sizeCheck.message);
        return;
      }

      setVehicleFiles((current) => ({
        ...current,
        [field]: file,
      }));
    } catch (error) {
      if (isDocumentPickerCancel(error)) return;
      Alert.alert('Could not select file', ownerApiErrorMessage(error));
    }
  };

  const loadDashboardData = async (sessionToken: string) => {
    setIsBusy(true);
    try {
      const [profileRes, dashboardRes, notifRes, earningsRes, payoutsRes, vehiclesRes, faqRes, ticketsRes, settingsRes, stationRes] = await Promise.all([
        ownerApi.me(sessionToken),
        ownerApi.dashboard(sessionToken),
        ownerApi.notifications(sessionToken),
        ownerApi.earnings(sessionToken, getEarningsRangeQuery(earningsRange)),
        ownerApi.payouts(sessionToken),
        ownerApi.vehicles(sessionToken),
        ownerApi.faqs(sessionToken),
        ownerApi.tickets(sessionToken),
        ownerApi.settings(sessionToken),
        ownerApi.stations(sessionToken).catch(() => ({ stations: [] as StationItem[] })),
      ]);

      syncProfileForm(profileRes.owner, profileRes.bank);
      setKyc(profileRes.kyc);
      setDashboard(dashboardRes.dashboard);
      setNotifications(notifRes.notifications || []);
      setEarnings(earningsRes);
      setPayouts(payoutsRes.payouts || []);
      setVehicles(vehiclesRes.vehicles || []);
      setFaqs(faqRes.faqs || []);
      setTickets(ticketsRes.tickets || []);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...settingsRes.settings,
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...(settingsRes.settings?.notifications || {}),
        },
      });
      setStations(stationRes.stations || []);
      setVehicleDetail(null);
    } catch (error) {
      Alert.alert('Could not load owner data', ownerApiErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  const refreshOwnerProfile = async (sessionToken: string) => {
    const result = await ownerApi.me(sessionToken);
    syncProfileForm(result.owner, result.bank);
    setOwner(result.owner);
    setKyc(result.kyc);
    return result;
  };

  const loadVehicles = async (sessionToken: string) => {
    const result = await ownerApi.vehicles(sessionToken);
    setVehicles(result.vehicles || []);
  };

  const loadNotifications = async (sessionToken: string) => {
    const result = await ownerApi.notifications(sessionToken);
    setNotifications(result.notifications || []);
  };

  const loadDashboard = async (sessionToken: string) => {
    const result = await ownerApi.dashboard(sessionToken);
    setDashboard(result.dashboard);
  };

  const loadEarnings = async (sessionToken: string, range: EarningsRange = earningsRange) => {
    const result = await ownerApi.earnings(sessionToken, getEarningsRangeQuery(range));
    setEarnings(result);
  };

  const loadProfile = async (sessionToken: string) => {
    const result = await ownerApi.profile(sessionToken);
    syncProfileForm(result.owner, result.bank);
    setDashboard(result.dashboard);
    setKyc(result.kyc);
  };

  const openDocumentUrl = async (url?: string | null, fallbackLabel?: string) => {
    const normalizedUrl = normalizeDocumentUrl(url);

    if (!normalizedUrl) {
      Alert.alert('Document unavailable', fallbackLabel || 'This document is not uploaded yet.');
      return;
    }

    try {
      await Linking.openURL(normalizedUrl);
    } catch (error) {
      Alert.alert(
        'Could not open document',
        fallbackLabel || ownerApiErrorMessage(error) || 'The document URL could not be opened on this device.',
      );
    }
  };

  const loadSupport = async (sessionToken: string) => {
    const [faqRes, ticketRes] = await Promise.all([ownerApi.faqs(sessionToken), ownerApi.tickets(sessionToken)]);
    setFaqs(faqRes.faqs || []);
    setTickets(ticketRes.tickets || []);
  };

  const loadSettings = async (sessionToken: string) => {
    const result = await ownerApi.settings(sessionToken);
    setSettings({
      ...DEFAULT_SETTINGS,
      ...result.settings,
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(result.settings?.notifications || {}),
      },
    });
  };

  useEffect(() => {
    let active = true;

    const bootstrapAuth = async () => {
      try {
        const storedToken =
          Platform.OS === 'android' && OwnerAuthStorage?.getItem
            ? await OwnerAuthStorage.getItem(AUTH_TOKEN_KEY)
            : null;
        if (!storedToken) {
          return;
        }

        const result = await refreshOwnerProfile(storedToken);
        if (!active) return;

        setToken(storedToken);

        if (result.owner?.kycStatus === 'APPROVED') {
          await loadDashboardData(storedToken);
          if (!active) return;
          setStep('dashboard');
          return;
        }

        if (result.owner?.kycStatus === 'PENDING' || result.owner?.kycStatus === 'REJECTED') {
          setStep('pending-approval');
          return;
        }

        setStep('register');
      } catch (error) {
        await clearAuthToken();
        console.log('Failed to restore owner session:', error);
      } finally {
        if (active) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    if (step === 'dashboard') void loadDashboard(token);
    if (step === 'notifications') void loadNotifications(token);
    if (step === 'earnings') void loadEarnings(token, earningsRange);
    if (step === 'vehicles') void loadVehicles(token);
    if (step === 'vehicle-details' && selectedVehicleId) {
      void ownerApi.vehicleDetail(token, selectedVehicleId).then((result) => setVehicleDetail(result.vehicle));
    }
    if (
      step === 'profile' ||
      step === 'profile-edit' ||
      step === 'documents' ||
      step === 'bank-details' ||
      step === 'bank-details-onboarding' ||
      step === 'bank-details-edit'
    ) {
      void loadProfile(token);
    }
    if (step === 'support') void loadSupport(token);
    if (step === 'settings') void loadSettings(token);
    if (step === 'request-payout') {
      void ownerApi.payouts(token).then((result) => setPayouts(result.payouts || []));
      void loadProfile(token);
    }
    if (step === 'vehicles' || step === 'vehicle-details' || step.startsWith('add-vehicle')) {
      void ownerApi
        .stations(token)
        .then((result) => setStations(result.stations || []))
        .catch(() => setStations([]));
    }
  }, [step, selectedVehicleId, token, earningsRange]);

  const handleContinue = async () => {
    if (normalizedPhone.length < 10) {
      Alert.alert('Enter a valid mobile number');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Please accept the terms and privacy policy');
      return;
    }

    setAuthBusy(true);
    try {
      await ownerApi.sendOtp(normalizedPhone);
      setOtp('');
      setStep('otp');
    } catch (error) {
      Alert.alert('Unable to send OTP', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      Alert.alert('Enter the full OTP');
      return;
    }

    setAuthBusy(true);
    try {
      const result = await ownerApi.verifyOtp({
        mobile: normalizedPhone,
        otp,
        name: fullName || undefined,
        companyName: 'MOVYRA Fleet',
      });
      setToken(result.token);
      void persistAuthToken(result.token);
      setOwner(result.owner);
      syncProfileForm(result.owner, bank);
      const nextStep = resolveKycStep(result.owner?.kycStatus);

      if (nextStep === 'dashboard') {
        await loadDashboardData(result.token);
        setStep('dashboard');
        return;
      }

      if (nextStep === 'pending-approval') {
        const latest = await refreshOwnerProfile(result.token);
        if (latest.owner?.kycStatus === 'APPROVED') {
          await loadDashboardData(result.token);
          setStep('dashboard');
          return;
        }
        setStep('pending-approval');
        return;
      }

      setStep('register');
    } catch (error) {
      Alert.alert('OTP verification failed', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegisterContinue = async () => {
    if (!validateRegisterForm()) return;

    setAuthBusy(true);
    try {
      const ownerPayload = {
        fullName,
        address,
        mobile: normalizedPhone,
        city,
        companyName: owner?.companyName || 'MOVYRA Fleet',
      };

      if (!token) {
        const result = await ownerApi.signup(ownerPayload);
        setToken(result.token);
        void persistAuthToken(result.token);
        setOwner(result.owner);
        syncProfileForm(result.owner, bank);

        if (result.owner?.kycStatus === 'APPROVED') {
          await loadDashboardData(result.token);
          setStep('dashboard');
          return;
        }

        setStep('kyc');
        return;
      }

      const result = await ownerApi.updateProfile(token, {
        name: fullName,
        address,
        adress: address,
        city,
        state: stateName,
        pincode,
        companyName: owner?.companyName || 'MOVYRA Fleet',
        profilePhoto: profilePhoto || undefined,
      });
      syncProfileForm(result.owner, result.bank);
      setOwner(result.owner);
      setProfilePhoto(DEFAULT_PROFILE_PHOTO);
      if (result.owner?.kycStatus === 'APPROVED') {
        await loadDashboardData(token);
        setStep('dashboard');
        return;
      }
      setStep('kyc');
    } catch (error) {
      Alert.alert('Could not save profile', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleKycSubmit = async () => {
    if (!token) return;
    if (!kycRequestDocument) {
      if (!kycFiles.profilePhoto || !kycFiles.adharFile || !kycFiles.panFile) {
        Alert.alert('Select all documents', 'Please upload Aadhaar, PAN, and profile photo before submitting.');
        return;
      }
    } else if (!kycFiles[kycRequestDocument]) {
      Alert.alert('Select a replacement document', 'Please upload the requested document before submitting.');
      return;
    }

    setAuthBusy(true);
    try {
      await ownerApi.submitKyc(token, kycFiles);
      setKycFiles(DEFAULT_KYC_FILES);
      setKycRequestDocument(null);
      setKycRequestOrigin(null);
      setOwner((current) => (current ? { ...current, kycStatus: 'PENDING' } : current));
      if (kycRequestOrigin === 'documents') {
        await loadProfile(token);
        setStep('documents');
      } else {
        setStep('bank-details-onboarding');
      }
    } catch (error) {
      const message = ownerApiErrorMessage(error);
      Alert.alert('Could not submit KYC', message);
      console.log('KYC submit failed:', error);
    } finally {
      setAuthBusy(false);
    }
  };

  const handlePickKycDocument = async (field: keyof KycUploadFiles) => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: field === 'profilePhoto' ? [DocumentPickerTypes.images] : [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
        copyTo: 'cachesDirectory',
        presentationStyle: 'fullScreen',
      });

      const fileName =
        response.name ||
        `${field}${field === 'profilePhoto' ? '.jpg' : '.pdf'}`;
      const uri = response.fileCopyUri ?? response.uri ?? undefined;
      const type = resolveMimeType(
        response.type,
        fileName,
        field === 'profilePhoto' ? 'image/jpeg' : 'application/pdf',
      );

      setKycFiles((current) => ({
        ...current,
        [field]: {
          uri,
          name: fileName,
          type,
          size: response.size,
        },
      }));
    } catch (error) {
      if (isDocumentPickerCancel(error)) return;
      Alert.alert('Could not select file', ownerApiErrorMessage(error));
    }
  };

  const handlePickBankDocument = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
        copyTo: 'cachesDirectory',
        presentationStyle: 'fullScreen',
      });

      const fileName = response.name || 'bank-document.pdf';
      const uri = response.fileCopyUri ?? response.uri ?? undefined;
      const type = resolveMimeType(response.type, fileName, 'application/pdf');

      setBankForm((current) => ({
        ...current,
        bankFile: {
          uri,
          name: fileName,
          type,
          size: response.size,
        },
      }));
    } catch (error) {
      if (isDocumentPickerCancel(error)) return;
      Alert.alert('Could not select file', ownerApiErrorMessage(error));
    }
  };

  const refreshActiveScreen = async () => {
    if (!token) return;
    if (step === 'dashboard') await loadDashboard(token);
    if (step === 'notifications') await loadNotifications(token);
    if (step === 'earnings') await loadEarnings(token, earningsRange);
    if (step === 'vehicles') await loadVehicles(token);
    if (step === 'support') await loadSupport(token);
    if (step === 'settings') await loadSettings(token);
  };

  const handleRequestPayout = async () => {
    if (!token) return;
    const amount = Number(payoutAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Enter a valid amount');
      return;
    }

    setAuthBusy(true);
    try {
      await ownerApi.requestPayout(token, amount);
      setPayoutAmount('');
      showNotice({
        title: 'Payout requested',
        message: 'Your payout request has been submitted successfully.',
      });
      const [payoutRes, dashboardRes] = await Promise.all([ownerApi.payouts(token), ownerApi.dashboard(token)]);
      setPayouts(payoutRes.payouts || []);
      setDashboard(dashboardRes.dashboard);
    } catch (error) {
      Alert.alert('Could not request payout', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    if (!token) return;
    try {
      await ownerApi.markNotificationRead(token, notificationId);
      setNotifications((current) =>
        current.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item)),
      );
    } catch (error) {
      Alert.alert('Could not update notification', ownerApiErrorMessage(error));
    }
  };

  const handleEarningsRangeChange = async (range: EarningsRange) => {
    setEarningsRange(range);
    if (!token) return;
    await loadEarnings(token, range);
  };

  const handleSettingsToggle = (key: keyof NonNullable<OwnerSettings['notifications']>, next: boolean) => {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(current.notifications || {}),
        [key]: next,
      },
    }));
  };

  const handleSaveSettings = async () => {
    if (!token) return;
    setAuthBusy(true);
    try {
      const result = await ownerApi.updateSettings(token, { settings });
      setSettings({
        ...DEFAULT_SETTINGS,
        ...result.settings,
        notifications: {
          ...DEFAULT_SETTINGS.notifications,
          ...(result.settings?.notifications || {}),
        },
      });
      showNotice({
        title: 'Settings saved',
        message: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      Alert.alert('Could not save settings', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleTicketSubmit = async () => {
    if (!token) return;
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Enter subject and message');
      return;
    }

    setAuthBusy(true);
    try {
      await ownerApi.createTicket(token, { subject: ticketSubject, message: ticketMessage });
      setTicketSubject('');
      setTicketMessage('');
      await loadSupport(token);
      showNotice({
        title: 'Support ticket created',
        message: 'Your request has been submitted. Our team will review it shortly.',
      });
    } catch (error) {
      Alert.alert('Could not create ticket', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleVehicleSubmit = async () => {
    if (!token) return;
    if (!vehicleForm.modelName.trim() || !vehicleForm.registrationNumber.trim() || !vehicleForm.chassisNumber.trim()) {
      Alert.alert('Complete vehicle details', 'Please fill in all vehicle information before submitting.');
      return;
    }
    if (!vehicleFiles.frontPhoto || !vehicleFiles.sidePhoto) {
      Alert.alert('Upload vehicle photos', 'Please upload both front and side photos before submitting.');
      return;
    }
    if (!vehicleFiles.rcDocument || !vehicleFiles.insuranceDocument) {
      Alert.alert('Upload required documents', 'Please upload RC and insurance documents before submitting.');
      return;
    }
    if (!vehicleForm.stationId) {
      Alert.alert('Select a station', 'Please choose a station before submitting the vehicle.');
      return;
    }
    setAuthBusy(true);
    try {
      if (step === 'add-vehicle-4') {
        await ownerApi.createVehicle(token, vehicleForm, vehicleFiles);
        setVehicleForm(DEFAULT_VEHICLE_FORM);
        setVehicleFiles(DEFAULT_VEHICLE_FILES);
        await loadVehicles(token);
        setStep('vehicles');
      }
    } catch (error) {
      Alert.alert('Could not add vehicle', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRemoveVehicle = async () => {
    if (!token || !activeVehicle) return;
    setAuthBusy(true);
    try {
      await ownerApi.removeVehicle(token, activeVehicle._id);
      await loadVehicles(token);
      setStep('vehicles');
    } catch (error) {
      Alert.alert('Could not remove vehicle', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const handleBankSubmit = async () => {
    if (!token) return;
    if (!validateBankForm()) return;
    setAuthBusy(true);
    try {
      const result = await ownerApi.updateBank(token, bankForm);
      setBank(result.bank);
      if (step === 'bank-details-onboarding') {
        setStep('pending-approval');
      } else {
        setShowBankEditModal(false);
      }
      await loadProfile(token);
      showNotice({
        title: 'Bank details updated',
        message: 'Your bank details were submitted for review.',
      });
    } catch (error) {
      Alert.alert('Could not update bank details', ownerApiErrorMessage(error));
    } finally {
      setAuthBusy(false);
    }
  };

  const renderScreen = () => {
    switch (step) {
      case 'login':
        return (
          <LoginScreen
            mobileNumber={mobileNumber}
            acceptedTerms={acceptedTerms}
            onToggleTerms={() => setAcceptedTerms((value) => !value)}
            onChangeMobile={setMobileNumber}
            onContinue={handleContinue}
            onRegisterPress={() => setStep('register')}
            loading={authBusy}
          />
        );
      case 'otp':
        return (
          <OtpScreen
            phoneNumber={normalizedPhone}
            otp={otp}
            onOtpChange={setOtp}
            onBack={() => setStep('login')}
            onChangeNumber={() => {
              setOtp('');
              setStep('login');
            }}
            onVerify={handleVerify}
            loading={authBusy}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            fullName={fullName}
            address={address}
            mobileNumber={mobileNumber}
            city={city}
            acceptedTerms={acceptedTerms}
            onToggleTerms={() => setAcceptedTerms((value) => !value)}
            onChangeFullName={setFullName}
            onChangeAddress={setAddress}
            onChangeMobile={setMobileNumber}
            onChangeCity={setCity}
            onContinue={handleRegisterContinue}
            onLoginPress={() => setStep('login')}
            loading={authBusy}
          />
        );
      case 'kyc':
        return (
          <KycScreen
            requestedDocument={kycRequestDocument}
            existingDocuments={{
              adharFileUrl: kyc?.documents?.adharFile || owner?.adharFile || undefined,
              panFileUrl: kyc?.documents?.panFile || owner?.panFile || undefined,
              profilePhotoUrl: owner?.profilePhotoUrl || undefined,
            }}
            onBack={() => {
              if (kycRequestOrigin === 'documents') {
                setStep('documents');
                return;
              }
              setStep('register');
            }}
            onNext={() => {
              if (kycRequestOrigin === 'documents') {
                setStep('documents');
                return;
              }
              setStep(resolveKycStep(owner?.kycStatus));
            }}
            onSubmit={handleKycSubmit}
            onPickDocument={handlePickKycDocument}
            documents={kycFiles}
            loading={authBusy}
          />
        );
      case 'pending-approval':
        return (
          <PendingApprovalScreen
            ownerName={owner?.name || fullName || 'Ravi'}
            status={owner?.kycStatus || 'PENDING'}
            rejectionReason={owner?.kycRejectionReason}
            onRetryKyc={() => setStep('kyc')}
          />
        );
      case 'activated':
        return <AccountActivatedScreen onGoToDashboard={() => setStep('dashboard')} />;
      case 'dashboard':
        return (
          <DashboardScreen
            owner={owner}
            dashboard={dashboard}
            notifications={notifications}
            onOpenNotifications={() => setStep('notifications')}
            onOpenPayout={() => setStep('request-payout')}
            onOpenEarnings={() => setStep('earnings')}
            onOpenAddVehicle={() => setStep('add-vehicle-1')}
            onOpenScooty={() => setStep('vehicles')}
            onOpenProfile={() => setStep('profile')}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'vehicles':
        return (
          <VehicleListScreen
            onBack={() => setStep('dashboard')}
            onOpenDetails={(vehicleId) => {
              setSelectedVehicleId(vehicleId);
              setStep('vehicle-details');
            }}
            onOpenProfile={() => setStep('profile')}
            onOpenEarnings={() => setStep('earnings')}
            onOpenAlerts={() => setStep('notifications')}
            onAddVehicle={() => setStep('add-vehicle-1')}
            onTabPress={handleBottomTabPress}
            vehicles={vehicles}
            stations={stations}
          />
        );
      case 'vehicle-details':
        return (
          <VehicleDetailsScreen
            onBack={() => setStep('vehicles')}
            onGoHome={() => setStep('dashboard')}
            onOpenMap={() => setStep('vehicle-map')}
            onRemove={() => setStep('vehicle-remove')}
            onOpenProfile={() => setStep('profile')}
            onTabPress={handleBottomTabPress}
            vehicle={activeVehicle}
            stations={stations}
          />
        );
      case 'vehicle-map':
        return (
          <MapViewScreen
            onBack={() => setStep('vehicle-details')}
            onGoHome={() => setStep('dashboard')}
            onTabPress={handleBottomTabPress}
            vehicle={activeVehicle}
            stations={stations}
          />
        );
      case 'vehicle-remove':
        return (
          <VehicleDetailsScreen
            onBack={() => setStep('vehicles')}
            onGoHome={() => setStep('dashboard')}
            onOpenMap={() => setStep('vehicle-map')}
            onRemove={handleRemoveVehicle}
            onOpenProfile={() => setStep('profile')}
            onTabPress={handleBottomTabPress}
            showRemoveModal
            vehicle={activeVehicle}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => setStep('dashboard')}
            notifications={notifications}
            onRefresh={refreshActiveScreen}
            onMarkRead={handleNotificationRead}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'request-payout':
        return (
          <RequestPayoutScreen
            onBack={() => setStep('dashboard')}
            availableBalance={dashboard?.walletBalance ?? owner?.walletBalance ?? 0}
            bank={bank}
            payouts={payouts}
            value={payoutAmount}
            onChangeValue={setPayoutAmount}
            onSubmit={handleRequestPayout}
            loading={authBusy}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'earnings':
        return (
          <EarningsScreen
            onBack={() => setStep('dashboard')}
            onRequestPayout={() => setStep('request-payout')}
            earnings={earnings}
            selectedRange={earningsRange}
            onRangeChange={handleEarningsRangeChange}
            onRefresh={refreshActiveScreen}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'add-vehicle-1':
        return (
          <AddVehicleScreen
            step={1}
            onBack={() => setStep('dashboard')}
            onNext={handleAddVehicleNext}
            form={vehicleForm}
            onChangeForm={(patch) => setVehicleForm((current) => ({ ...current, ...patch }))}
            stations={stations}
            frontPhoto={vehicleFiles.frontPhoto}
            sidePhoto={vehicleFiles.sidePhoto}
            rcDocument={vehicleFiles.rcDocument}
            insuranceDocument={vehicleFiles.insuranceDocument}
            onPickFrontPhoto={() =>
              void setVehicleFile('frontPhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'front-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickSidePhoto={() =>
              void setVehicleFile('sidePhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'side-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickRcDocument={() =>
              void setVehicleFile('rcDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'rc-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            onPickInsuranceDocument={() =>
              void setVehicleFile('insuranceDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'insurance-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            loading={authBusy}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'add-vehicle-2':
        return (
          <AddVehicleScreen
            step={2}
            onBack={() => setStep('add-vehicle-1')}
            onNext={handleAddVehicleNext}
            form={vehicleForm}
            onChangeForm={(patch) => setVehicleForm((current) => ({ ...current, ...patch }))}
            stations={stations}
            frontPhoto={vehicleFiles.frontPhoto}
            sidePhoto={vehicleFiles.sidePhoto}
            rcDocument={vehicleFiles.rcDocument}
            insuranceDocument={vehicleFiles.insuranceDocument}
            onPickFrontPhoto={() =>
              void setVehicleFile('frontPhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'front-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickSidePhoto={() =>
              void setVehicleFile('sidePhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'side-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickRcDocument={() =>
              void setVehicleFile('rcDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'rc-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            onPickInsuranceDocument={() =>
              void setVehicleFile('insuranceDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'insurance-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            loading={authBusy}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'add-vehicle-3':
        return (
          <AddVehicleScreen
            step={3}
            onBack={() => setStep('add-vehicle-2')}
            onNext={handleAddVehicleNext}
            form={vehicleForm}
            onChangeForm={(patch) => setVehicleForm((current) => ({ ...current, ...patch }))}
            stations={stations}
            frontPhoto={vehicleFiles.frontPhoto}
            sidePhoto={vehicleFiles.sidePhoto}
            rcDocument={vehicleFiles.rcDocument}
            insuranceDocument={vehicleFiles.insuranceDocument}
            onPickFrontPhoto={() =>
              void setVehicleFile('frontPhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'front-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickSidePhoto={() =>
              void setVehicleFile('sidePhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'side-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickRcDocument={() =>
              void setVehicleFile('rcDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'rc-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            onPickInsuranceDocument={() =>
              void setVehicleFile('insuranceDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'insurance-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            loading={authBusy}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'add-vehicle-4':
        return (
          <AddVehicleScreen
            step={4}
            onBack={() => setStep('add-vehicle-3')}
            onNext={handleAddVehicleNext}
            form={vehicleForm}
            onChangeForm={(patch) => setVehicleForm((current) => ({ ...current, ...patch }))}
            stations={stations}
            frontPhoto={vehicleFiles.frontPhoto}
            sidePhoto={vehicleFiles.sidePhoto}
            rcDocument={vehicleFiles.rcDocument}
            insuranceDocument={vehicleFiles.insuranceDocument}
            onPickFrontPhoto={() =>
              void setVehicleFile('frontPhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'front-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickSidePhoto={() =>
              void setVehicleFile('sidePhoto', {
                type: [DocumentPickerTypes.images],
                fallbackName: 'side-photo.jpg',
                fallbackType: 'image/jpeg',
              })
            }
            onPickRcDocument={() =>
              void setVehicleFile('rcDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'rc-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            onPickInsuranceDocument={() =>
              void setVehicleFile('insuranceDocument', {
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                fallbackName: 'insurance-document.pdf',
                fallbackType: 'application/pdf',
              })
            }
            loading={authBusy}
            onTabPress={handleBottomTabPress}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setStep('dashboard')}
            onOpenEditProfile={() => setStep('profile-edit')}
            onOpenSettings={() => setStep('settings')}
            onOpenSupport={() => setStep('support')}
            onOpenDocuments={() => setStep('documents')}
            onOpenBankDetails={() => setStep('bank-details')}
            onLogout={() => {
              void clearAuthToken();
              setToken(null);
              setStep('login');
            }}
            onTabPress={handleBottomTabPress}
            owner={owner}
            bank={bank}
            dashboard={dashboard}
            kyc={kyc}
          />
        );
      case 'profile-edit':
        return (
          <EditProfileScreen
            onBack={() => setStep('profile')}
            onSubmit={handleProfileSave}
            owner={owner}
            form={{
              fullName,
              email,
              mobile: owner?.mobile || normalizedPhone,
              address,
              city,
              state: stateName,
              pincode,
            }}
            onChangeForm={(patch) => {
              if (patch.fullName !== undefined) setFullName(patch.fullName);
              if (patch.email !== undefined) setEmail(patch.email);
              if (patch.address !== undefined) setAddress(patch.address);
              if (patch.city !== undefined) setCity(patch.city);
              if (patch.state !== undefined) setStateName(patch.state);
              if (patch.pincode !== undefined) setPincode(patch.pincode);
            }}
            profilePhoto={profilePhoto}
            onPickProfilePhoto={handlePickProfilePhoto}
            loading={authBusy}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setStep('profile')}
            settings={settings}
            onToggleSetting={handleSettingsToggle}
            onSave={handleSaveSettings}
          />
        );
      case 'support':
        return (
          <SupportScreen
            onBack={() => setStep('profile')}
            faqs={faqs}
            tickets={tickets}
            subject={ticketSubject}
            message={ticketMessage}
            onChangeSubject={setTicketSubject}
            onChangeMessage={setTicketMessage}
            onSubmitTicket={handleTicketSubmit}
            loading={authBusy}
          />
        );
      case 'documents':
        return (
          <DocumentsScreen
            onBack={() => setStep('profile')}
            owner={owner}
            kyc={kyc}
            vehicles={vehicles}
            onViewAadhaar={() => void openDocumentUrl(kyc?.documents?.adharFile || owner?.adharFile, 'Aadhaar document is not available yet.')}
            onViewPan={() => void openDocumentUrl(kyc?.documents?.panFile || owner?.panFile, 'PAN document is not available yet.')}
            onViewInsurance={() => void openDocumentUrl(vehicles[0]?.documents?.insuranceUrl, 'Insurance document is not available yet.')}
            onRequestChange={(field) => {
              if (field === 'insurance') {
                Alert.alert('Change insurance document', 'Please update insurance documents from your vehicle details screen.');
                setStep('vehicles');
                return;
              }
              setKycRequestOrigin('documents');
              setKycRequestDocument(field);
              setStep('kyc');
            }}
          />
        );
      case 'bank-details':
        return (
          <BankDetailsScreen
            onBack={() => setStep('profile')}
            onOpenEdit={() => setShowBankEditModal(true)}
            bank={bank}
            form={bankForm}
            onChangeForm={(patch) => setBankForm((current) => ({ ...current, ...patch }))}
            onSubmit={handleBankSubmit}
            showEditModal={showBankEditModal}
          />
        );
      case 'bank-details-onboarding':
        return (
          <BankDetailsScreen
            mode="onboarding"
            onBack={() => setStep('kyc')}
            onOpenEdit={() => setShowBankEditModal(true)}
            bank={bank}
            form={bankForm}
            onPickBankDocument={handlePickBankDocument}
            onChangeForm={(patch) => setBankForm((current) => ({ ...current, ...patch }))}
            onSubmit={handleBankSubmit}
          />
        );
      case 'bank-details-edit':
        return (
          <BankDetailsScreen
            onBack={() => setStep('profile')}
            onOpenEdit={() => setShowBankEditModal(false)}
            bank={bank}
            form={bankForm}
            onChangeForm={(patch) => setBankForm((current) => ({ ...current, ...patch }))}
            onSubmit={handleBankSubmit}
            showEditModal
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (step === 'bank-details') {
      setShowBankEditModal(false);
    }
    if (step === 'bank-details-edit') {
      setShowBankEditModal(true);
    }
  }, [step]);

  useEffect(() => {
    if (!token || step !== 'pending-approval') return;

    let active = true;

    const checkKycStatus = async () => {
      try {
        const result = await refreshOwnerProfile(token);
        if (!active) return;

        if (result.owner?.kycStatus === 'APPROVED') {
          await loadDashboardData(token);
          setStep('dashboard');
        }
      } catch {
        // Keep the waiting screen visible even if a refresh fails.
      }
    };

    void checkKycStatus();
    const timer = setInterval(() => {
      void checkKycStatus();
    }, 15000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [step, token]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>{isBootstrapping ? null : renderScreen()}</View>
      <NoticeModal
        visible={Boolean(notice)}
        title={notice?.title || ''}
        message={notice?.message}
        actionLabel={notice?.actionLabel || 'OK'}
        onAction={hideNotice}
      />
    </SafeAreaView>
  );
}

const textDefaultProps = Text as typeof Text & { defaultProps?: { style?: unknown } };
textDefaultProps.defaultProps = textDefaultProps.defaultProps ?? {};
textDefaultProps.defaultProps.style = [{ fontFamily: FONTS.regular }, textDefaultProps.defaultProps.style];

const textInputDefaultProps = TextInput as typeof TextInput & { defaultProps?: { style?: unknown } };
textInputDefaultProps.defaultProps = textInputDefaultProps.defaultProps ?? {};
textInputDefaultProps.defaultProps.style = [
  { fontFamily: FONTS.regular },
  textInputDefaultProps.defaultProps.style,
];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#efe8e4',
  },
  container: {
    flex: 1,
  },
});
