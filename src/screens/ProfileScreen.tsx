import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DocumentFileIcon,
  HelpIcon,
  LogoutIcon,
  SettingsIcon,
  SquarePenIcon,
} from '../components/OwnerIcons';
import { Bank, Dashboard, Owner, OwnerKyc } from '../services/ownerApi';

type ProfileMenuKey = 'editProfile' | 'bankDetails' | 'documents' | 'settings' | 'support';

type ProfileMenuItem = {
  key: ProfileMenuKey;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress?: () => void;
};

export function ProfileScreen({
  onBack,
  onOpenEditProfile,
  onOpenSettings,
  onOpenSupport,
  onOpenDocuments,
  onOpenBankDetails,
  onLogout,
  onTabPress,
  owner,
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
  const displayName = owner?.name || owner?.companyName || 'Profile not set';
  const displayPhone = owner?.mobile ? `+91 ${owner.mobile}` : 'Mobile number unavailable';
  const displayEmail = owner?.email || 'Email not added';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
  const profilePhotoUrl = owner?.profilePhotoUrl || '';

  const editItem: ProfileMenuItem = {
    key: 'editProfile',
    title: 'Edit Profile',
    icon: <SquarePenIcon size={22} color="#fc4c02" />,
    onPress: onOpenEditProfile,
  };

  const menu: ProfileMenuItem[] = [
    {
      key: 'bankDetails',
      title: 'Bank Details',
      icon: <CreditCardIcon size={22} color="#fc4c02" />,
      onPress: onOpenBankDetails,
    },
    {
      key: 'documents',
      title: 'Documents',
      icon: <DocumentFileIcon size={22} color="#fc4c02" />,
      onPress: onOpenDocuments,
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: <SettingsIcon size={22} color="#fc4c02" />,
      onPress: onOpenSettings,
    },
    {
      key: 'support',
      title: 'Help & Support',
      icon: <HelpIcon size={22} color="#fc4c02" />,
      onPress: onOpenSupport,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />

      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#1c1c1e" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
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
          <Text style={styles.meta} numberOfLines={1}>
            {displayPhone}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {displayEmail}
          </Text>
        </View>
        <Pressable onPress={onOpenEditProfile} style={styles.editButton}>
          <SquarePenIcon size={20} color="#363636" />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuCard}>
          <MenuRow item={editItem} onPress={editItem.onPress ?? (() => {})} />
        </View>

        <View style={styles.menuCard}>
          {menu.map((m, i) => (
            <View key={m.key}>
              <MenuRow item={m} onPress={m.onPress ?? (() => {})} />
              {i < menu.length - 1 ? <View style={styles.menuDivider} /> : null}
            </View>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <LogoutIcon size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      <BottomTabs active="profile" onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

function MenuRow({ item, onPress }: { item: ProfileMenuItem; onPress: () => void }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIconWrap}>{item.icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.menuSubtitle}>{item.subtitle}</Text> : null}
      </View>
      <ChevronRightIcon size={20} color="#9ca3af" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.26)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    color: '#1C1C1E',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.62)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#363636',
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
  profileText: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#363636',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  meta: {
    color: '#363636',
    fontSize: 14,
    lineHeight: 20,
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 24,
    paddingVertical: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    color: '#101828',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  menuSubtitle: {
    color: '#6a7282',
    fontSize: 14,
    lineHeight: 20,
  },
  menuDivider: {
    marginLeft: 72,
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 51,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ef4444',
    marginTop: 4,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
  },
  version: {
    textAlign: 'center',
    color: '#6a7282',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
  },
});
