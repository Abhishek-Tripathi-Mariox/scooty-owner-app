import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { COLORS, SPACING } from '../constants/theme';
import { Bank, PayoutItem } from '../services/ownerApi';
import { formatCurrency, formatShortDate } from '../utils/format';

function HistoryItem({
  amount,
  date,
  status,
}: {
  amount: string;
  date: string;
  status: string;
}) {
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Text style={styles.historyIconText}>✓</Text>
      </View>
      <View style={styles.historyBody}>
        <Text style={styles.historyAmount}>{amount}</Text>
        <Text style={styles.historyDate}>{date}</Text>
      </View>
      <Text style={styles.historyStatus}>{status}</Text>
    </View>
  );
}

export function RequestPayoutScreen({
  onBack,
  availableBalance = 0,
  bank,
  payouts = [],
  value,
  onChangeValue,
  onSubmit,
  loading = false,
  onTabPress,
}: {
  onBack: () => void;
  availableBalance?: number;
  bank?: Bank | null;
  payouts?: PayoutItem[];
  value: string;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  onTabPress: (tab: TabKey) => void;
}) {
  return (
    <View style={styles.root}>
      <AppBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.header}>
            <Pressable onPress={onBack} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <Text style={styles.heading}>Request payout</Text>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>{formatCurrency(availableBalance)}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Payout Amount</Text>
            <TextInput
              value={value}
              onChangeText={onChangeValue}
              keyboardType="number-pad"
              placeholder="₹ Enter amount"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
            <Text style={styles.helper}>Minimum: ₹100 - Processing time: 1-2 business days</Text>

            <Text style={styles.label}>Bank Account</Text>
            <View style={styles.bankRow}>
              <View>
                <Text style={styles.bankName}>{bank?.accountNumber ? `•••• •••• •••• ${bank.accountNumber.slice(-4)}` : 'No bank details'}</Text>
                <Text style={styles.bankSub}>{bank?.bankName || bank?.upiId || 'Add bank details to continue'}</Text>
              </View>
              <Text style={styles.change}>Verified</Text>
            </View>

            <View style={styles.quickAmounts}>
              {['1000', '5000', '10000'].map((amount) => (
                <Pressable key={amount} style={styles.amountChip} onPress={() => onChangeValue(amount)}>
                  <Text style={styles.amountChipText}>{formatCurrency(Number(amount))}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.requestButton} onPress={onSubmit}>
              <Text style={styles.requestButtonText}>{loading ? 'Submitting...' : 'Request Payout'}</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Payout History</Text>
          {payouts.length > 0 ? (
            payouts.map((item) => (
              <HistoryItem
                key={item._id}
                amount={formatCurrency(item.amount)}
                date={`${formatShortDate(item.createdAt)} •••• ${item.bankSnapshot?.accountNumberLast4 || '----'}`}
                status={item.status.toLowerCase()}
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No payouts yet</Text>
              <Text style={styles.emptyText}>Your payout requests will show up here once you submit one.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomTabs active="home" onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  content: { paddingHorizontal: SPACING.screenX, paddingTop: 18, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  back: { width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  backText: { fontSize: 24, color: COLORS.textPrimary },
  heading: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary },
  balanceCard: {
    backgroundColor: COLORS.button,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, textAlign: 'center' },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center', marginTop: 6 },
  formCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
  },
  label: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '800', marginTop: 8, marginBottom: 6 },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
  },
  helper: { marginTop: 6, color: COLORS.textMuted, fontSize: 10, lineHeight: 14 },
  bankRow: {
    marginTop: 4,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.68)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ece3de',
  },
  bankName: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  bankSub: { marginTop: 2, color: COLORS.textSecondary, fontSize: 11 },
  change: { color: '#22c55e', fontSize: 12, fontWeight: '800' },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  amountChip: {
    width: '31%',
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountChipText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700' },
  requestButton: {
    marginTop: 14,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  sectionTitle: { marginTop: 16, marginBottom: 10, color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 10,
  },
  historyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eef7ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyIconText: { color: '#16a34a', fontWeight: '900' },
  historyBody: { flex: 1 },
  historyAmount: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
  historyDate: { marginTop: 4, color: COLORS.textSecondary, fontSize: 11 },
  historyStatus: { fontSize: 11, color: COLORS.textPrimary, fontWeight: '800' },
  empty: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '900' },
  emptyText: { marginTop: 6, color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
});
