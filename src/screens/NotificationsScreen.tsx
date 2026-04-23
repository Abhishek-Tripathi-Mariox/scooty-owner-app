import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ActivityIcon,
  AlertCircleIcon,
  ArrowLeftIcon,
  RupeeIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { NotificationItem } from '../services/ownerApi';
import { formatShortDate } from '../utils/format';

type NotificationFilter = 'ALL' | 'RIDE' | 'EARNING' | 'ALERT' | 'SYSTEM';

const FILTERS: Array<{ key: NotificationFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'RIDE', label: 'Rides' },
  { key: 'EARNING', label: 'Money' },
  { key: 'ALERT', label: 'Alerts' },
  { key: 'SYSTEM', label: 'System' },
];

function iconForType(type?: string) {
  const normalized = (type || '').toUpperCase();
  if (normalized.includes('ALERT')) return <AlertCircleIcon size={20} color="#0f172a" />;
  if (normalized.includes('EARNING') || normalized.includes('MONEY'))
    return <RupeeIcon size={20} color="#0f172a" />;
  return <ActivityIcon size={20} color="#0f172a" />;
}

function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconWrap}>{iconForType(item.type)}</View>
      <View style={styles.body}>
        <View style={styles.bodyTopRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formatShortDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        {!item.isRead ? <Text style={styles.newTag}>New</Text> : null}
      </View>
    </Pressable>
  );
}

export function NotificationsScreen({
  onBack,
  notifications = [],
  onRefresh,
  onMarkRead,
  onTabPress,
}: {
  onBack: () => void;
  notifications?: NotificationItem[];
  onRefresh?: () => void;
  onMarkRead?: (notificationId: string) => void;
  onTabPress: (tab: TabKey) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('ALL');
  const unread = notifications.filter((item) => !item.isRead).length;
  const visibleNotifications = useMemo(
    () =>
      selectedFilter === 'ALL'
        ? notifications
        : notifications.filter((item) => item.type === selectedFilter),
    [notifications, selectedFilter],
  );

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>Notifications</Text>
        <Pressable onPress={onRefresh}>
          <Text style={styles.newCount}>{unread} New</Text>
        </Pressable>
      </View>

      <View style={styles.tabsShell}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {FILTERS.map((tab) => {
            const isActive = tab.key === selectedFilter;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setSelectedFilter(tab.key)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {visibleNotifications.length > 0 ? (
          visibleNotifications.map((item) => (
            <NotificationCard
              key={item._id}
              item={item}
              onPress={!item.isRead ? () => onMarkRead?.(item._id) : undefined}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'ALL' ? 'No notifications yet' : `No ${selectedFilter.toLowerCase()} notifications`}
            </Text>
            <Text style={styles.emptyText}>
              Once your vehicles start generating activity, alerts, earnings and ride updates will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomTabs active="alerts" onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  topbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.26)',
    gap: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#101828',
    lineHeight: 28,
  },
  newCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fc4c02',
    lineHeight: 28,
  },
  tabsShell: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabsRow: {
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.33)',
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#fc4c02',
  },
  tabText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#0f172a',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderLeftWidth: 3.485,
    borderLeftColor: '#fc4c02',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  bodyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  message: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  newTag: {
    marginTop: 4,
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  emptyCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
