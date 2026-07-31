import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  ShieldCheckIcon,
} from '../components/OwnerIcons';
import { OwnerSettings } from '../services/ownerApi';

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable
      style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
      onPress={() => onChange(!value)}
      hitSlop={8}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </Pressable>
  );
}

function NotificationRow({
  title,
  subtitle,
  value,
  onToggle,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationTextWrap}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationSubtitle}>{subtitle}</Text>
      </View>
      <Toggle value={value} onChange={onToggle} />
    </View>
  );
}

function GeneralRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.generalRow} onPress={onPress}>
      <View style={styles.generalIcon}>{icon}</View>
      <View style={styles.generalTextWrap}>
        <Text style={styles.generalTitle}>{title}</Text>
        <Text style={styles.generalSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRightIcon size={20} color="#64748b" />
    </Pressable>
  );
}

export function SettingsScreen({
  onBack,
  settings,
  onToggleSetting,
  onTabPress,
}: {
  onBack: () => void;
  settings?: OwnerSettings | null;
  onToggleSetting?: (key: keyof NonNullable<OwnerSettings['notifications']>, next: boolean) => void;
  onSave?: () => void;
  onTabPress?: (tab: TabKey) => void;
}) {
  const notifications = settings?.notifications || {};

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.heading}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <View style={styles.notificationsList}>
            <NotificationRow
              title="Ride Updates"
              subtitle="Get notified about ride starts & completions"
              value={notifications.rideUpdates ?? true}
              onToggle={(next) => onToggleSetting?.('rideUpdates', next)}
            />
            <NotificationRow
              title="Earnings"
              subtitle="Payout and transaction notifications"
              value={notifications.earnings ?? true}
              onToggle={(next) => onToggleSetting?.('earnings', next)}
            />
            <NotificationRow
              title="Alerts"
              subtitle="Low battery & maintenance alerts"
              value={notifications.maintenance ?? true}
              onToggle={(next) => onToggleSetting?.('maintenance', next)}
            />
            <NotificationRow
              title="Marketing"
              subtitle="Promotional offers & updates"
              value={notifications.promotions ?? false}
              onToggle={(next) => onToggleSetting?.('promotions', next)}
            />
          </View>
        </View>

        <View style={styles.card}>
          <GeneralRow
            icon={<GlobeIcon size={20} color="#fc4c02" />}
            title="Language"
            subtitle={settings?.language || 'English (India)'}
          />
          <GeneralRow
            icon={<ShieldCheckIcon size={20} color="#fc4c02" />}
            title="Privacy Policy"
            subtitle="View our privacy policy"
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      <BottomTabs active="profile" onTabPress={onTabPress ?? (() => undefined)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  topbar: {
    height: 96,
    paddingHorizontal: 24,
    paddingTop: 40,
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
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 16,
  },
  notificationsList: {
    gap: 16,
    paddingBottom: 8,
    fontSize: 20,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 30,
  },
  notificationTextWrap: {
    flex: 1,
  },
  notificationTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  notificationSubtitle: {
    marginTop: 2,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#fc4c02',
  },
  toggleOff: {
    backgroundColor: '#cbd5e1',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  generalRow: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 0,
  },
  generalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,122,69,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generalTextWrap: {
    flex: 1,
  },
  generalTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
  },
  generalSubtitle: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  version: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});
