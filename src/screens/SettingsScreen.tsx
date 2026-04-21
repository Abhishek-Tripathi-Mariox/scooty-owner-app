import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
import { OwnerSettings } from '../services/ownerApi';

function SettingRow({
  title,
  subtitle,
  toggle = false,
  value = false,
  onToggle,
}: {
  title: string;
  subtitle: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>•</Text>
        </View>
        <View>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {toggle ? (
        <Switch value={value} onValueChange={onToggle} />
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </View>
  );
}

export function SettingsScreen({
  onBack,
  settings,
  onToggleSetting,
  onSave,
}: {
  onBack: () => void;
  settings?: OwnerSettings | null;
  onToggleSetting?: (key: keyof NonNullable<OwnerSettings['notifications']>, next: boolean) => void;
  onSave?: () => void;
}) {
  const notifications = settings?.notifications || {};

  return (
    <PageFrame title="Settings" onBack={onBack} scroll>
      <View style={styles.card}>
        <Text style={styles.section}>Notifications</Text>
        <SettingRow
          title="Ride Updates"
          subtitle="Get notified about ride starts & completions"
          toggle
          value={notifications.rideUpdates ?? true}
          onToggle={(next) => onToggleSetting?.('rideUpdates', next)}
        />
        <SettingRow
          title="Earnings"
          subtitle="Payout and transaction notifications"
          toggle
          value={notifications.earnings ?? true}
          onToggle={(next) => onToggleSetting?.('earnings', next)}
        />
        <SettingRow
          title="Alerts"
          subtitle="Low battery & maintenance alerts"
          toggle
          value={notifications.maintenance ?? true}
          onToggle={(next) => onToggleSetting?.('maintenance', next)}
        />
        <SettingRow
          title="Marketing"
          subtitle="Promotional offers & updates"
          toggle
          value={notifications.promotions ?? false}
          onToggle={(next) => onToggleSetting?.('promotions', next)}
        />
      </View>

      <View style={styles.card}>
        <SettingRow title="Language" subtitle={settings?.language || 'English (India)'} />
        <SettingRow title="Privacy Policy" subtitle="View our privacy policy" />
      </View>

      {onSave ? (
        <Pressable style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>Save Settings</Text>
        </Pressable>
      ) : null}

      <Text style={styles.version}>Version 1.0.0</Text>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 8,
    marginBottom: 12,
  },
  section: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff4ef',
    marginRight: 10,
  },
  iconText: { color: COLORS.button, fontSize: 16, fontWeight: '900' },
  rowTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
  rowSubtitle: { marginTop: 2, color: COLORS.textSecondary, fontSize: 11 },
  chevron: { color: COLORS.textSecondary, fontSize: 22 },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: 11, marginTop: 6 },
  saveButton: {
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});

