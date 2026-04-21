import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { COLORS, SPACING } from '../constants/theme';
import { EarningsResponse } from '../services/ownerApi';
import { formatCurrency, formatShortDate } from '../utils/format';

type EarningsRange = 'today' | 'week' | 'month';

const RANGE_OPTIONS: Array<{ key: EarningsRange; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export function EarningsScreen({
  onBack,
  onRequestPayout,
  earnings,
  selectedRange,
  onRangeChange,
  onRefresh,
  onTabPress,
}: {
  onBack: () => void;
  onRequestPayout: () => void;
  earnings?: EarningsResponse | null;
  selectedRange: EarningsRange;
  onRangeChange: (range: EarningsRange) => void;
  onRefresh?: () => void;
  onTabPress: (tab: TabKey) => void;
}) {
  const trend = earnings?.trend ?? [];
  const vehicleWise = earnings?.vehicleWise ?? [];
  const recentTransactions = earnings?.recentTransactions ?? [];
  const rangeLabel = RANGE_OPTIONS.find((item) => item.key === selectedRange)?.label || 'Today';
  const maxTrendValue = Math.max(...trend.map((item) => item.value), 0);
  const maxVehicleValue = Math.max(...vehicleWise.map((item) => item.value), 0);

  return (
    <View style={styles.root}>
      <AppBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.heading}>Earnings</Text>
          <Pressable onPress={onRefresh}>
            <Text style={styles.export}>Refresh</Text>
          </Pressable>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{rangeLabel} Earnings</Text>
          <Text style={styles.totalValue}>{formatCurrency(earnings?.summary?.month ?? 0)}</Text>
          <Text style={styles.totalDelta}>↗ from recent owner earnings activity</Text>
        </View>

        <View style={styles.segmentRow}>
          {RANGE_OPTIONS.map((segment) => {
            const isActive = segment.key === selectedRange;
            return (
              <Pressable key={segment.key} onPress={() => onRangeChange(segment.key)} style={[styles.segment, isActive && styles.segmentActive]}>
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{segment.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Trend</Text>
          <View style={styles.chartArea}>
            {trend.length > 0 ? (
              <>
                <View style={styles.gridLine} />
                <View style={styles.chartBars}>
                  {trend.map((bar) => {
                    const height = maxTrendValue > 0 ? Math.max(12, Math.round((bar.value / maxTrendValue) * 110)) : 12;
                    return (
                      <View key={`${bar.date || bar.label}`} style={styles.barWrap}>
                        <View style={[styles.bar, { height }]} />
                        <Text style={styles.barLabel}>{bar.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              <Text style={styles.emptyChartText}>No earnings trend data yet.</Text>
            )}
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Vehicle-wise Earnings</Text>
          {vehicleWise.length > 0 ? (
            <View style={styles.vehicleBars}>
              {vehicleWise.map((item) => {
                const height = maxVehicleValue > 0 ? Math.max(18, Math.round((item.value / maxVehicleValue) * 100)) : 18;
                return (
                  <View key={item.label} style={styles.vehicleItem}>
                    <View style={[styles.vehicleBar, { height }]} />
                    <Text style={styles.vehicleLabel} numberOfLines={1}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyChartText}>No vehicle earnings data yet.</Text>
          )}
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Income</Text>
            <Text style={styles.metricValue}>{formatCurrency(earnings?.summary?.totalCredit ?? 0)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Deductions</Text>
            <Text style={[styles.metricValue, styles.metricNegative]}>
              {formatCurrency(earnings?.summary?.totalDebit ?? 0)}
            </Text>
          </View>
        </View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.chartTitle}>Recent Transactions</Text>
          <Text style={styles.export}>Export</Text>
        </View>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((item, index) => (
            <TransactionRow
              key={item._id || `${item.type}-${index}`}
              left="₹"
              title={item.description || item.type || 'Transaction'}
              amount={`${item.direction === 'DEBIT' ? '-' : '+'}${formatCurrency(item.amount ?? 0)}`}
              negative={item.direction === 'DEBIT'}
              date={formatShortDate(item.createdAt)}
            />
          ))
        ) : (
          <>
            <TransactionRow left="₹" title="No recent transactions" amount="₹0" />
          </>
        )}

        <Pressable style={styles.button} onPress={onRequestPayout}>
          <Text style={styles.buttonText}>Request Payout  →</Text>
        </Pressable>
      </ScrollView>
      <BottomTabs active="earnings" onTabPress={onTabPress} />
    </View>
  );
}

function TransactionRow({
  left,
  title,
  amount,
  negative,
  date,
}: {
  left: string;
  title: string;
  amount: string;
  negative?: boolean;
  date?: string;
}) {
  return (
    <View style={styles.txItem}>
      <Text style={styles.txLeft}>{left}</Text>
      <View style={styles.txBody}>
        <Text style={styles.txTitle}>{title}</Text>
        <Text style={styles.txDate}>{date || '—'}</Text>
      </View>
      <Text style={[styles.txAmount, negative && styles.txNegative]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: SPACING.screenX, paddingTop: 18, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  back: { width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  backText: { fontSize: 24, color: COLORS.textPrimary },
  heading: { flex: 1, fontSize: 19, fontWeight: '900', color: COLORS.textPrimary },
  export: { fontSize: 12, fontWeight: '800', color: COLORS.button },
  totalCard: {
    backgroundColor: COLORS.button,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  totalLabel: { color: 'rgba(255,255,255,0.86)', fontSize: 12 },
  totalValue: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 8 },
  totalDelta: { marginTop: 8, color: 'rgba(255,255,255,0.9)', fontSize: 11 },
  segmentRow: { flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 12 },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  segmentActive: { backgroundColor: '#fff' },
  segmentText: { fontSize: 11, color: COLORS.textSecondary },
  segmentTextActive: { color: COLORS.textPrimary, fontWeight: '800' },
  chartCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  chartTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 12 },
  chartArea: {
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.48)',
    borderWidth: 1,
    borderColor: '#ece3de',
    padding: 10,
    justifyContent: 'flex-end',
  },
  emptyChartText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 60,
  },
  gridLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 90,
    height: 1,
    backgroundColor: '#e7ded8',
  },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%' },
  barWrap: { alignItems: 'center', width: 30 },
  bar: {
    width: 16,
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  barLabel: { marginTop: 6, fontSize: 9, color: COLORS.textSecondary },
  vehicleBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  vehicleItem: { alignItems: 'center', width: '22%' },
  vehicleBar: { width: 26, borderRadius: 6, backgroundColor: '#22c55e', marginBottom: 6 },
  vehicleLabel: { fontSize: 10, color: COLORS.textSecondary },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricCard: {
    width: '48.5%',
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricLabel: { color: COLORS.textSecondary, fontSize: 12 },
  metricValue: { marginTop: 6, color: COLORS.textPrimary, fontSize: 18, fontWeight: '900' },
  metricNegative: { color: '#f43f5e' },
  transactionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  txLeft: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff4ef',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: COLORS.textPrimary,
    fontWeight: '900',
    marginRight: 10,
  },
  txBody: { flex: 1 },
  txTitle: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '800' },
  txDate: { marginTop: 4, fontSize: 10, color: COLORS.textMuted },
  txAmount: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '800' },
  txNegative: { color: '#f43f5e' },
  button: {
    marginTop: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '800' },
});
