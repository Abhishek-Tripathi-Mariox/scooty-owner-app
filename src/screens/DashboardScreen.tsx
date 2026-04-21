import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { COLORS, SPACING } from '../constants/theme';
import { Owner, Dashboard, NotificationItem } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Tile({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileTitle}>{title}</Text>
    </View>
  );
}

function ActivityItem({ title, detail, time }: { title: string; detail: string; time: string }) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>↯</Text>
      </View>
      <View style={styles.activityBody}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDetail}>{detail}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
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
  onOpenProfile,
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

  const activitySource = notifications?.slice(0, 4) ?? [];
  const activityCards =
    activitySource.length > 0
      ? activitySource.map((item) => ({
          title: item.title || 'Notification',
          detail: item.message || '',
          time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
        }))
      : [
          { title: 'Ride Started', detail: 'Live activity will appear here once the backend has notifications.', time: 'Now' },
          { title: 'Ride Completed', detail: 'Completed rides and alerts are streamed from owner notifications.', time: 'Today' },
        ];

  return (
    <View style={styles.root}>
      <AppBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSmall}>Good Morning</Text>
            <Text style={styles.greetingName}>{owner?.name || 'Owner'}</Text>
          </View>
          <Pressable onPress={onOpenNotifications} style={styles.bellWrap}>
            <Text style={styles.bell}>🔔</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{String(unreadCount)}</Text>
            </View>
          </Pressable>
        </View>

        <Card>
          <Text style={styles.sectionLabel}>Today&apos;s Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsValue}>{formatCurrency(dashboard?.earnings?.today ?? 0)}</Text>
            <Text style={styles.trend}>↗</Text>
          </View>
        </Card>

        <Card style={styles.walletCard}>
          <View style={styles.walletLeft}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletValue}>{formatCurrency(dashboard?.walletBalance ?? owner?.walletBalance ?? 0)}</Text>
          </View>
          <Pressable style={styles.withdrawButton} onPress={onOpenPayout}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </Pressable>
        </Card>

        <View style={styles.grid}>
          <Tile title="Total Vehicles" value={String(dashboard?.vehicles?.total ?? 0)} icon="🚗" />
          <Tile title="Active" value={String(vehicleStats.ACTIVE ?? 0)} icon="◔" />
          <Tile title="In Ride" value={String(vehicleStats.IN_RIDE ?? 0)} icon="↯" />
          <Tile title="Maintenance" value={String(dashboard?.maintenanceOpenCount ?? 0)} icon="🛠" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionCard} onPress={onOpenAddVehicle}>
            <Text style={styles.actionIcon}>＋</Text>
            <Text style={styles.actionText}>Add Vehicle</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={onOpenEarnings}>
            <Text style={styles.actionIcon}>₹</Text>
            <Text style={styles.actionText}>Earnings</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={onOpenScooty}>
            <Text style={styles.actionIcon}>🔧</Text>
            <Text style={styles.actionText}>Vehicles</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Activity</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        {activityCards.map((item) => (
          <ActivityItem key={`${item.title}-${item.time}`} title={item.title} detail={item.detail} time={item.time} />
        ))}
      </ScrollView>
      <BottomTabs
        active="home"
        onTabPress={onTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: SPACING.screenX,
    paddingTop: 18,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greetingSmall: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  bellWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 10,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  earningsValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
  trend: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletLeft: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  walletValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  withdrawButton: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawText: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tile: {
    width: '48.5%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  tileIcon: {
    fontSize: 18,
    marginBottom: 12,
  },
  tileValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  tileTitle: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  viewAll: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff4ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityIconText: {
    color: COLORS.button,
    fontWeight: '900',
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  activityDetail: {
    marginTop: 4,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  activityTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
