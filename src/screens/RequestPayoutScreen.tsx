import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { Bank, PayoutItem } from '../services/ownerApi';
import { formatCurrency, formatShortDate } from '../utils/format';

function GradientHeader() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="payoutBalanceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#payoutBalanceGrad)" />
    </Svg>
  );
}

function HistoryItem({
  amount,
  date,
  status,
}: {
  amount: string;
  date: string;
  status: string;
}) {
  const isProcessing = status.toLowerCase() === 'processing';
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIconWrap}>
        {isProcessing ? (
          <ClockIcon size={20} color="#64748b" />
        ) : (
          <CheckCircleIcon size={20} color="#22c55e" />
        )}
      </View>
      <View style={styles.historyBody}>
        <Text style={styles.historyAmount}>{amount}</Text>
        <Text style={styles.historyDate}>{date}</Text>
      </View>
      <Text style={styles.historyStatus}>{status.toLowerCase()}</Text>
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
  const accountMask = bank?.accountNumber
    ? `•••• •••• •••• ${bank.accountNumber.slice(-4)}`
    : 'No bank details';

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>Request payout</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.balanceCard}>
            <View style={StyleSheet.absoluteFill}>
              <GradientHeader />
            </View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>{formatCurrency(availableBalance)}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Payout Amount</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputCurrency}>₹</Text>
                <TextInput
                  value={value}
                  onChangeText={onChangeValue}
                  keyboardType="number-pad"
                  placeholder="Enter amount"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                />
              </View>
              <Text style={styles.helper}>
                Minimum: ₹100 • Processing time: 1-2 business days
              </Text>
            </View>

            <View style={styles.bankCard}>
              <Text style={styles.bankLabel}>Bank Account</Text>
              <View style={styles.bankRow}>
                <View style={styles.bankTextWrap}>
                  <Text style={styles.bankNumber}>{accountMask}</Text>
                  <Text style={styles.bankName}>{bank?.bankName || 'Add bank details'}</Text>
                </View>
                <Pressable>
                  <Text style={styles.change}>Change</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.quickAmounts}>
              {['1000', '5000', '10000'].map((amount) => (
                <Pressable
                  key={amount}
                  style={styles.amountChip}
                  onPress={() => onChangeValue(amount)}
                >
                  <Text style={styles.amountChipText}>{formatCurrency(Number(amount))}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.requestButton, loading && styles.requestButtonDisabled]}
              onPress={onSubmit}
              disabled={loading}
            >
              <Text style={styles.requestButtonText}>
                {loading ? 'Submitting...' : 'Request Payout'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Payout History</Text>
          {payouts.length > 0 ? (
            payouts.map((item) => (
              <HistoryItem
                key={item._id}
                amount={formatCurrency(item.amount)}
                date={`${formatShortDate(item.createdAt)} • •••• ${
                  item.bankSnapshot?.accountNumberLast4 || '----'
                }`}
                status={item.status}
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No payouts yet</Text>
              <Text style={styles.emptyText}>
                Your payout requests will show up here once you submit one.
              </Text>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  balanceCard: {
    borderRadius: 12,
    height: 116,
    paddingHorizontal: 24,
    paddingTop: 24,
    overflow: 'hidden',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  balanceValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    lineHeight: 14,
  },
  inputRow: {
    height: 56,
    borderRadius: 10,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: 'rgba(255,255,255,0.34)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputCurrency: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#0f172a',
    fontSize: 20,
    paddingVertical: 0,
  },
  helper: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  bankCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(241,245,249,0.5)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  bankLabel: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankTextWrap: {
    flex: 1,
  },
  bankNumber: {
    color: '#0f172a',
    fontSize: 14,
    lineHeight: 20,
  },
  bankName: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  change: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  amountChip: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountChipText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  requestButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonDisabled: {
    opacity: 0.6,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  historyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34,197,94,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBody: { flex: 1 },
  historyAmount: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  historyDate: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  historyStatus: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  empty: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
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
