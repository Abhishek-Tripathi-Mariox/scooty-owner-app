import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { COLORS, SPACING } from '../constants/theme';
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

function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.leftAccent, !item.isRead && styles.leftAccentActive]} />
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.message}</Text>
        <Text style={styles.tag}>{item.type}</Text>
      </View>
      <Text style={styles.date}>{formatShortDate(item.createdAt)}</Text>
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
    () => (selectedFilter === 'ALL' ? notifications : notifications.filter((item) => item.type === selectedFilter)),
    [notifications, selectedFilter],
  );

  return (
    <View style={styles.root}>
      <AppBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.heading}>Notifications</Text>
          <Pressable onPress={onRefresh}>
            <Text style={styles.newCount}>{unread} New</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          {FILTERS.map((tab) => {
            const isActive = tab.key === selectedFilter;
            return (
              <Pressable key={tab.key} onPress={() => setSelectedFilter(tab.key)} style={[styles.tab, isActive && styles.activeTab]}>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>

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
            <Text style={styles.emptyTitle}>{selectedFilter === 'ALL' ? 'No notifications yet' : `No ${selectedFilter.toLowerCase()} notifications`}</Text>
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
  content: { paddingHorizontal: SPACING.screenX, paddingTop: 18, paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  back: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  backText: { fontSize: 24, color: COLORS.textPrimary },
  heading: { flex: 1, fontSize: 19, fontWeight: '900', color: COLORS.textPrimary },
  newCount: { fontSize: 12, color: COLORS.button, fontWeight: '800' },
  tabs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeTab: { backgroundColor: COLORS.button },
  tabText: { fontSize: 11, color: COLORS.textPrimary },
  activeTabText: { color: '#fff', fontWeight: '800' },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 10,
  },
  leftAccent: {
    width: 3,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
    minHeight: 66,
  },
  leftAccentActive: {
    backgroundColor: COLORS.button,
  },
  body: { flex: 1 },
  title: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  text: { marginTop: 4, fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  tag: { marginTop: 8, fontSize: 11, color: COLORS.button, fontWeight: '800' },
  date: { fontSize: 10, color: COLORS.textMuted },
  emptyCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
