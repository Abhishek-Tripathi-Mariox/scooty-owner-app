import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  BankIcon,
  ChevronRightIcon,
  DocumentFileIcon,
  HelpIcon,
  LocationPinIcon,
  LogoutIcon,
  MailIcon,
  PencilIcon,
  PhoneCallIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from '../components/OwnerIcons';
import { Bank, Dashboard, Owner, OwnerKyc } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

function GradientHeaderBg() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="profileHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#profileHeaderGrad)" rx={32} ry={32} />
    </Svg>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconWrap}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRightIcon size={20} color="#64748b" />
    </Pressable>
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
  bank: _bank,
  dashboard,
  kyc,
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
  const name = owner?.name || owner?.companyName || 'Vehicle Owner';
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
  const profilePhotoUrl = owner?.profilePhotoUrl || '';
  const isVerified = kyc?.status === 'APPROVED' || owner?.kycStatus === 'APPROVED';
  const averageRating = dashboard?.averageRating;

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={StyleSheet.absoluteFill}>
            <GradientHeaderBg />
          </View>
          <Text style={styles.headerTitle}>Profile</Text>

          <View style={styles.identityCard}>
            <View style={styles.identityRow}>
              <View style={styles.avatar}>
                {profilePhotoUrl ? (
                  <Image source={{ uri: profilePhotoUrl }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.avatarText}>{initials}</Text>
                )}
              </View>
              <View style={styles.identityTextWrap}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.verifiedRow}>
                  <ShieldCheckIcon size={16} color="#0f172a" />
                  <Text style={styles.verifiedText}>
                    {isVerified ? 'Verified Owner' : 'Owner Profile'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contactList}>
              <View style={styles.contactRow}>
                <MailIcon size={16} color="#0f172a" />
                <Text style={styles.contactText}>{owner?.email || 'No email set'}</Text>
              </View>
              <View style={styles.contactRow}>
                <PhoneCallIcon size={16} color="#0f172a" />
                <Text style={styles.contactText}>
                  {owner?.mobile ? `+91 ${owner.mobile}` : 'No mobile set'}
                </Text>
              </View>
              <View style={styles.contactRow}>
                <LocationPinIcon size={16} color="#0f172a" />
                <Text style={styles.contactText}>
                  {owner?.city || owner?.state || 'City not set'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <Stat value={String(dashboard?.vehicles?.total ?? 0)} label="Vehicles" highlight />
            <Stat
              value={formatCurrency(owner?.walletBalance ?? dashboard?.walletBalance ?? 0)}
              label="Earnings"
            />
            <Stat value={averageRating != null ? averageRating.toFixed(1) : '—'} label="Rating" />
          </View>

          <View style={styles.menuCard}>
            <MenuItem
              icon={<PencilIcon size={20} color="#fc4c02" />}
              label="Edit Profile"
              onPress={onOpenEditProfile}
            />
            <MenuItem
              icon={<BankIcon size={20} color="#fc4c02" />}
              label="Bank Details"
              onPress={onOpenBankDetails}
            />
            <MenuItem
              icon={<DocumentFileIcon size={20} color="#fc4c02" />}
              label="Documents"
              onPress={onOpenDocuments}
            />
            <MenuItem
              icon={<SettingsIcon size={20} color="#fc4c02" />}
              label="Settings"
              onPress={onOpenSettings}
            />
            <MenuItem
              icon={<HelpIcon size={20} color="#fc4c02" />}
              label="Support"
              onPress={onOpenSupport}
            />
          </View>

          <Pressable style={styles.logout} onPress={onLogout}>
            <LogoutIcon size={16} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomTabs active="profile" onTabPress={onTabPress} />
    </View>
  );
}

function Stat({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    gap: 24,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  identityCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 24,
    lineHeight: 32,
  },
  identityTextWrap: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  contactList: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    height: 84,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  statValueHighlight: {
    color: '#fc4c02',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  menuCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  menuItem: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderRadius: 16,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(252,76,2,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  logout: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#ef4444',
    backgroundColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
