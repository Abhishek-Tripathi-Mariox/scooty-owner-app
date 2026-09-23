import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  CheckCircleIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DocumentFileIcon,
  HelpIcon,
  LocationPinIcon,
  LogoutIcon,
  MailIcon,
  PhoneCallIcon,
  SettingsIcon,
  SquarePenIcon,
} from '../components/OwnerIcons';
import { Bank, Dashboard, Owner, OwnerKyc } from '../services/ownerApi';
import { formatCompactCurrency } from '../utils/format';
import { useScreenInsets } from '../utils/insets';
import { useStyles } from '../utils/responsiveStyles';

type ProfileMenuKey = 'editProfile' | 'bankDetails' | 'documents' | 'settings' | 'support';

type ProfileMenuItem = {
  key: ProfileMenuKey;
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

function HeaderGradient() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="profileHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ff6a33" stopOpacity={1} />
          <Stop offset="100%" stopColor="#fb4a01" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#profileHeaderGrad)" />
    </Svg>
  );
}

export function ProfileScreen({
  onOpenEditProfile,
  onOpenSettings,
  onOpenSupport,
  onOpenDocuments,
  onOpenBankDetails,
  onLogout,
  onTabPress,
  owner,
  dashboard,
}: {
  onBack: () => void;
  onOpenEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onOpenDocuments: () => void;
  onOpenBankDetails: () => void;
  onLogout: () => void;
  onTabPress: (tab: TabKey) => void;
  owner?: Owner | null;
  bank?: Bank | null;
  dashboard?: Dashboard | null;
  kyc?: OwnerKyc | null;
}) {
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
  const displayName = owner?.name || owner?.companyName || 'Profile not set';
  const displayPhone = owner?.mobile ? `+91 ${owner.mobile}` : 'Mobile number unavailable';
  const displayEmail = owner?.email || 'Email not added';
  const displayCity = owner?.city || owner?.state || 'Location not added';
  const isVerified = owner?.kycStatus === 'APPROVED';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
  const profilePhotoUrl = owner?.profilePhotoUrl || '';

  const vehiclesCount = dashboard?.vehicles?.total ?? 0;
  const earnings = dashboard?.earnings?.month ?? 0;
  const rating = dashboard?.averageRating;

  const menu: ProfileMenuItem[] = [
    {
      key: 'editProfile',
      title: 'Edit Profile',
      icon: <SquarePenIcon size={20} color="#fc4c02" />,
      onPress: onOpenEditProfile,
    },
    {
      key: 'bankDetails',
      title: 'Bank Details',
      icon: <CreditCardIcon size={20} color="#fc4c02" />,
      onPress: onOpenBankDetails,
    },
    {
      key: 'documents',
      title: 'Documents',
      icon: <DocumentFileIcon size={20} color="#fc4c02" />,
      onPress: onOpenDocuments,
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: <SettingsIcon size={20} color="#fc4c02" />,
      onPress: onOpenSettings,
    },
    {
      key: 'support',
      title: 'Support',
      icon: <HelpIcon size={20} color="#fc4c02" />,
      onPress: onOpenSupport,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.headerBlock, { paddingTop: insets.headerTop + 8 }]}>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <HeaderGradient />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatar}>
                {profilePhotoUrl ? (
                  <Image source={{ uri: profilePhotoUrl }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.avatarText}>{initials || 'OW'}</Text>
                )}
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name} numberOfLines={1}>
                  {displayName}
                </Text>
                {isVerified ? (
                  <View style={styles.verifiedRow}>
                    <CheckCircleIcon size={15} color="#111827" />
                    <Text style={styles.verifiedText}>Verified Owner</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.contactRow}>
              <MailIcon size={16} color="#374151" />
              <Text style={styles.contactText} numberOfLines={1}>
                {displayEmail}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <PhoneCallIcon size={16} color="#374151" />
              <Text style={styles.contactText} numberOfLines={1}>
                {displayPhone}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <LocationPinIcon size={16} color="#374151" />
              <Text style={styles.contactText} numberOfLines={1}>
                {displayCity}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.statValueOrange]}>{String(vehiclesCount)}</Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCompactCurrency(earnings)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{rating != null ? rating.toFixed(1) : '—'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          <View style={styles.menuCard}>
            {menu.map((item, index) => (
              <View key={item.key}>
                <Pressable style={styles.menuRow} onPress={item.onPress ?? (() => {})}>
                  <View style={styles.menuIconWrap}>{item.icon}</View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <ChevronRightIcon size={20} color="#334155" />
                </Pressable>
                {index < menu.length - 1 ? <View style={styles.menuDivider} /> : null}
              </View>
            ))}
          </View>

          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <LogoutIcon size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomTabs active="profile" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const RAW_STYLES = {
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerBlock: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderBottomRightRadius: 44,
    overflow: 'hidden',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 16,
  },
  profileCard: {
    borderRadius: 20,
    backgroundColor: '#ffe8db',
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontSize: 22,
    fontWeight: '700',
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 26,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  verifiedText: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(17,24,39,0.1)',
    marginVertical: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    flex: 1,
    color: '#1f2937',
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  statValueOrange: {
    color: '#fc4c02',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
  },
  menuCard: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    borderRadius: 24,
    paddingVertical: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(252,76,2,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    flex: 1,
    color: '#101828',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  menuDivider: {
    marginLeft: 72,
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.06)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
} as const;
