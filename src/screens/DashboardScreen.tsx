import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ActivityIcon,
  AlertCircleIcon,
  BellIcon,
  CarIcon,
  CheckCircleIcon,
  PlusIcon,
  RupeeIcon,
  TrendUpIcon,
  WalletIcon,
  WrenchIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { Owner, Dashboard, NotificationItem, type DashboardActivityItem } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

function Tile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={styles.tile}>
      <View style={styles.tileTopRow}>
        {icon}
        <Text style={styles.tileValue}>{value}</Text>
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({
  label,
  icon,
  onPress,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIconCircle, active && styles.actionIconCircleActive]}>{icon}</View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function ActivityCard({
  title,
  detail,
  time,
  icon,
}: {
  title: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIconWrap}>{icon}</View>
      <View style={styles.activityBody}>
        <View style={styles.activityRow}>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
        <Text style={styles.activityDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function pickActivityIcon(type?: string) {
  const normalized = (type || '').toUpperCase();
  if (normalized.includes('ALERT')) return <AlertCircleIcon size={20} color="#0f172a" />;
  if (normalized.includes('EARNING') || normalized.includes('BONUS') || normalized.includes('MONEY'))
    return <RupeeIcon size={20} color="#0f172a" />;
  return <ActivityIcon size={20} color="#0f172a" />;
}

export function DashboardScreen({
  owner,
  dashboard,
  notifications,
  onOpenNotifications,
  onOpenPayout,
  onOpenEarnings,
  onOpenAddVehicle,
  onOpenScooty,
  onOpenProfile: _onOpenProfile,
  onTabPress,
}: {
  owner?: Owner | null;
  dashboard?: Dashboard | null;
  notifications?: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenPayout: () => void;
  onOpenEarnings: () => void;
  onOpenAddVehicle: () => void;
  onOpenScooty: () => void;
  onOpenProfile: () => void;
  onTabPress: (tab: TabKey) => void;
}) {
  const unreadCount = dashboard?.unreadNotifications ?? notifications?.filter((item) => !item.isRead).length ?? 0;
  const vehicleStats = dashboard?.vehicles?.byStatus || {};
  const walletBalance = dashboard?.walletBalance ?? owner?.walletBalance ?? 0;
  const todaysEarnings = dashboard?.earnings?.today ?? 0;

  const activityCards: DashboardActivityItem[] =
    dashboard?.liveActivity?.length
      ? dashboard.liveActivity
      : notifications?.slice(0, 4).map((item) => ({
          title: item.title || 'Notification',
          detail: item.message || '',
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : '',
          type: item.type,
          createdAt: item.createdAt,
        })) || [];

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.headerShell}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <View style={styles.greetingWrap}>
              <Text style={styles.greetingSmall}>Good Morning</Text>
              <Text style={styles.greetingName}>{owner?.name || 'Owner'}</Text>
            </View>
            <Pressable onPress={onOpenNotifications} style={styles.bellWrap}>
              <BellIcon size={24} color="#0f172a" />
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{String(unreadCount)}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          <View style={styles.earningsCard}>
            <View style={styles.earningsLeft}>
              <Text style={styles.earningsLabel}>Today&apos;s Earnings</Text>
              <Text style={styles.earningsValue}>{formatCurrency(todaysEarnings)}</Text>
            </View>
            <TrendUpIcon size={28} color="#0f172a" />
          </View>

          <View style={styles.walletCard}>
            <View style={styles.walletIconWrap}>
              <WalletIcon size={20} color="#fc4c02" />
            </View>
            <View style={styles.walletTextWrap}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletValue}>{formatCurrency(walletBalance)}</Text>
            </View>
            <Pressable style={styles.withdrawButton} onPress={onOpenPayout}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </Pressable>
          </View>

          <View style={styles.tilesRow}>
            <Tile
              label="Total Vehicles"
              value={String(dashboard?.vehicles?.total ?? 0)}
              icon={<CarIcon size={20} color="#fc4c02" />}
            />
            <Tile
              label="Active"
              value={String(vehicleStats.ACTIVE ?? 0)}
              icon={<CheckCircleIcon size={20} color="#0f172a" />}
            />
          </View>
          <View style={styles.tilesRow}>
            <Tile
              label="In Ride"
              value={String(vehicleStats.IN_RIDE ?? 0)}
              icon={<ActivityIcon size={20} color="#0f172a" />}
            />
            <Tile
              label="Maintenance"
              value={String(dashboard?.maintenanceOpenCount ?? 0)}
              icon={<WrenchIcon size={20} color="#fc4c02" />}
            />
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <ActionCard
              label="Add Vehicle"
              icon={<PlusIcon size={22} color="#0f172a" />}
              onPress={onOpenAddVehicle}
              active
            />
            <ActionCard
              label="Earnings"
              icon={<RupeeIcon size={22} color="#0f172a" />}
              onPress={onOpenEarnings}
            />
            <ActionCard
              label="Maintenance"
              icon={<WrenchIcon size={22} color="#0f172a" />}
              onPress={onOpenScooty}
            />
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Live Activity</Text>
            <Pressable onPress={onOpenNotifications}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>
          {activityCards.length > 0 ? (
            activityCards.map((item, idx) => (
              <ActivityCard
                key={`${item.title}-${idx}`}
                title={item.title}
                detail={item.detail}
                time={item.time || ''}
                icon={pickActivityIcon(item.type)}
              />
            ))
          ) : (
            <View style={styles.emptyActivityCard}>
              <Text style={styles.emptyActivityTitle}>No live activity yet</Text>
              <Text style={styles.emptyActivityText}>
                Ride updates, earnings, alerts, and payouts will show up here as soon as the backend has activity to surface.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <BottomTabs active="home" onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerShell: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingWrap: {
    flex: 1,
  },
  greetingSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textPrimary,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: COLORS.textPrimary,
  },
  bellWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  earningsCard: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.162,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  earningsLeft: {
    flex: 1,
  },
  earningsLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  earningsValue: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  walletCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 24,
  },
  walletIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,230,219,0.76)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletTextWrap: {
    flex: 1,
  },
  walletLabel: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  walletValue: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  withdrawButton: {
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#fc4c02',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawText: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tile: {
    flex: 1,
    height: 92,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tileValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  tileLabel: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  viewAll: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  actionCard: {
    width: 106,
    height: 106,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  actionLabel: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  activityCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderLeftWidth: 3.485,
    borderLeftColor: '#fc4c02',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  activityIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: {
    flex: 1,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  activityTime: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  activityDetail: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyActivityCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
  },
  emptyActivityTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyActivityText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
  },
});
