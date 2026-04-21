import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
import { Bank, Dashboard, Owner, OwnerKyc } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

// Import profile icon images
const EditIcon = require('../assets/images/profile/edit.png');
const SettingIcon = require('../assets/images/profile/setting.png');
const BankIcon = require('../assets/images/profile/bank.png');
const CallIcon = require('../assets/images/profile/call.png');
const EmailIcon = require('../assets/images/profile/email.png');
const LocationIcon = require('../assets/images/profile/location1.png');
const VerifiedIcon = require('../assets/images/profile/verified.png');
const DocumentIcon = require('../assets/images/profile/document.png');
const SupportIcon = require('../assets/images/profile/support1.png');
const LogoutIcon = require('../assets/images/profile/logout1.png');  
function MenuItem({
  iconSource,
  label,
  onPress,
}: {
  iconSource: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Image source={iconSource} style={styles.menuIconImage} resizeMode="contain" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </Pressable>
  );
}

function SupportMenuItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Image source={SupportIcon} style={styles.menuIconImage} resizeMode="contain" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </Pressable>
  );
}

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
  bank,
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
  const initials = (owner?.name || owner?.companyName || 'Owner')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
  const profilePhotoUrl = owner?.profilePhotoUrl || '';

  return (
    <View style={styles.root}>
      <PageFrame title="Profile" onBack={onBack} scroll={false}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <View style={styles.heroCard}>
              <View style={styles.identityRow}>
                <View style={styles.avatar}>
                  {profilePhotoUrl ? (
                    <Image source={{ uri: profilePhotoUrl }} style={styles.avatarImage} resizeMode="cover" />
                  ) : (
                    <Text style={styles.avatarText}>{initials}</Text>
                  )}
                </View>
                <View style={styles.identityCopy}>
                  <Text style={styles.name}>{owner?.name || 'Vehicle Owner'}</Text>
                  {kyc?.status === 'APPROVED' ? (
                    <View style={styles.badgeContainer}>
                      <Image source={VerifiedIcon} style={styles.badgeIcon} resizeMode="contain" />
                      <Text style={styles.badge}>Verified Owner</Text>
                    </View>
                  ) : (
                    <Text style={styles.badge}>Owner Profile</Text>
                  )}
                </View>
              </View>

              <View style={styles.contactList}>
                <InfoRow iconSource={EmailIcon} value={owner?.email || 'No email set'} />
                <InfoRow iconSource={CallIcon} value={owner?.mobile ? `+91 ${owner.mobile}` : 'No mobile set'} />
                <InfoRow iconSource={LocationIcon} value={owner?.city || owner?.state || 'City not set'} />
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Stat label="Vehicles" value={String(dashboard?.vehicles?.total ?? 0)} />
            <Stat label="Earnings" value={formatCurrency(owner?.walletBalance ?? dashboard?.walletBalance ?? 0)} />
            <Stat label="Rating" value="4.8" />
          </View>

          <View style={styles.menuCard}>
            <MenuItem iconSource={EditIcon} label="Edit Profile" onPress={onOpenEditProfile} />
            <MenuItem iconSource={BankIcon} label="Bank Details" onPress={onOpenBankDetails} />
            <MenuItem iconSource={DocumentIcon} label="Documents" onPress={onOpenDocuments} />
            <MenuItem iconSource={SettingIcon} label="Settings" onPress={onOpenSettings} />
            <SupportMenuItem label="Support" onPress={onOpenSupport} />
          </View>

          <Pressable style={styles.logout} onPress={onLogout}>
            <Image source={LogoutIcon} style={styles.logoutIcon} resizeMode="contain" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </ScrollView>
      </PageFrame>
      <BottomTabs
        active="profile"
        onTabPress={onTabPress}
      />
    </View>
  );
}

function InfoRow({ iconSource, value }: { iconSource: any; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Image source={iconSource} style={styles.infoIconImage} resizeMode="contain" />
      </View>
      <Text style={styles.infoText}>{value}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 16 },
  hero: {
    borderRadius: 24,
    backgroundColor: COLORS.button,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,244,239,0.92)',
    padding: 14,
  },
  identityRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 17 },
  identityCopy: { flex: 1 },
  name: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '900' },
  badgeContainer: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  badgeIcon: { width: 12, height: 12, marginRight: 4 },
  badge: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
  contactList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(33,48,74,0.08)',
    marginTop: 12,
    paddingTop: 8,
  },
  infoRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIconContainer: {
    width: 20,
    height: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIconImage: {
    width: '100%',
    height: '100%',
  },
  infoText: { color: COLORS.textPrimary, fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  stat: {
    width: '31%',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  statLabel: { marginTop: 4, color: COLORS.textSecondary, fontSize: 10 },
  menuCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  menuItem: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2ebe7',
  },
  menuIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff4ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuIconImage: {
    width: '100%',
    height: '100%',
  },
  menuLabel: { flex: 1, color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
  menuArrow: { color: COLORS.textSecondary, fontSize: 22 },
  logout: {
    marginTop: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff8686',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row',
    gap: 8,
  },
  logoutIcon: { width: 20, height: 20 },
  logoutText: { color: '#ef4444', fontSize: 13, fontWeight: '900' },
});
