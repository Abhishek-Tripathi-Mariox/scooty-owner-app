import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Polyline,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { GradientButton } from '../components/GradientButton';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  RupeeIcon,
  TrendUpIcon,
} from '../components/OwnerIcons';
import { COLORS } from '../constants/theme';
import { EarningsResponse } from '../services/ownerApi';
import { formatCurrency, formatShortDate } from '../utils/format';

type EarningsRange = 'today' | 'week' | 'month';

const RANGE_OPTIONS: Array<{ key: EarningsRange; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const CHART_WIDTH = 295;
const CHART_HEIGHT = 200;
const CHART_PAD_L = 40;
const CHART_PAD_R = 8;
const CHART_PAD_T = 10;
const CHART_PAD_B = 32;

function GradientRect() {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="earningsTotalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#fc4c02" stopOpacity={1} />
          <Stop offset="100%" stopColor="#ff7a45" stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#earningsTotalGrad)" />
    </Svg>
  );
}

function LineChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (data.length === 0) {
    return <Text style={styles.emptyChart}>No earnings trend data yet.</Text>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const innerW = CHART_WIDTH - CHART_PAD_L - CHART_PAD_R;
  const innerH = CHART_HEIGHT - CHART_PAD_T - CHART_PAD_B;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
  const points = data.map((d, i) => {
    const x = CHART_PAD_L + i * stepX;
    const y = CHART_PAD_T + innerH - (d.value / max) * innerH;
    return { x, y };
  });
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((r) => CHART_PAD_T + innerH * r);
  const gridValues = [max, max * 0.75, max * 0.5, max * 0.25, 0];
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {gridYs.map((y, i) => (
        <Line key={`grid-${i}`} x1={CHART_PAD_L} y1={y} x2={CHART_WIDTH - CHART_PAD_R} y2={y} stroke="#e2e8f0" strokeWidth={1} />
      ))}
      {gridValues.map((v, i) => (
        <SvgLabel key={`yl-${i}`} x={CHART_PAD_L - 6} y={gridYs[i] + 3} align="end" text={Math.round(v).toString()} />
      ))}
      <Polyline points={polyline} fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <Circle key={`pt-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#22c55e" />
      ))}
      {data.map((d, i) => (
        <SvgLabel
          key={`xl-${i}`}
          x={points[i].x}
          y={CHART_PAD_T + innerH + 16}
          align="middle"
          text={d.label}
        />
      ))}
    </Svg>
  );
}

function BarChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  if (data.length === 0) {
    return <Text style={styles.emptyChart}>No vehicle earnings data yet.</Text>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const innerW = CHART_WIDTH - CHART_PAD_L - CHART_PAD_R;
  const innerH = CHART_HEIGHT - CHART_PAD_T - CHART_PAD_B;
  const slot = innerW / data.length;
  const barW = Math.min(36, slot * 0.55);
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map((r) => CHART_PAD_T + innerH * r);
  const gridValues = [max, max * 0.75, max * 0.5, max * 0.25, 0];

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {gridYs.map((y, i) => (
        <Line key={`bg-${i}`} x1={CHART_PAD_L} y1={y} x2={CHART_WIDTH - CHART_PAD_R} y2={y} stroke="#e2e8f0" strokeWidth={1} />
      ))}
      {gridValues.map((v, i) => (
        <SvgLabel key={`byl-${i}`} x={CHART_PAD_L - 6} y={gridYs[i] + 3} align="end" text={Math.round(v).toString()} />
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = CHART_PAD_L + slot * i + (slot - barW) / 2;
        const y = CHART_PAD_T + innerH - h;
        return (
          <Rect key={`bar-${i}`} x={x} y={y} width={barW} height={h} rx={4} fill="#22c55e" />
        );
      })}
      {data.map((d, i) => (
        <SvgLabel
          key={`bxl-${i}`}
          x={CHART_PAD_L + slot * i + slot / 2}
          y={CHART_PAD_T + innerH + 16}
          align="middle"
          text={d.label}
        />
      ))}
    </Svg>
  );
}

function SvgLabel({ x, y, text, align }: { x: number; y: number; text: string; align: 'start' | 'middle' | 'end' }) {
  return (
    <SvgText x={x} y={y} textAnchor={align} fontSize={10} fill="#64748b" fontFamily="System">
      {text}
    </SvgText>
  );
}

function TransactionRow({
  title,
  date,
  amount,
  negative,
  accent,
}: {
  title: string;
  date?: string;
  amount: string;
  negative?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={styles.txItem}>
      <View style={[styles.txIconWrap, negative && styles.txIconWrapNegative]}>
        {negative ? (
          <RupeeIcon size={20} color="#ef4444" />
        ) : (
          <RupeeIcon size={20} color={accent ? '#22c55e' : '#0f172a'} />
        )}
      </View>
      <View style={styles.txBody}>
        <Text style={styles.txTitle}>{title}</Text>
        <Text style={styles.txDate}>{date || '—'}</Text>
      </View>
      <Text style={[styles.txAmount, negative && styles.txNegative]}>{amount}</Text>
    </View>
  );
}

export function EarningsScreen({
  onBack,
  onRequestPayout,
  earnings,
  selectedRange,
  onRangeChange,
  onRefresh: _onRefresh,
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

  const totalEarnings = earnings?.summary?.month ?? 0;
  const trendDeltaText = (() => {
    if (trend.length < 2) return 'Live backend data';
    const previous = trend[trend.length - 2]?.value ?? 0;
    const current = trend[trend.length - 1]?.value ?? 0;
    if (previous === 0) {
      return current > 0 ? 'New earnings in the latest period' : 'No change from the previous period';
    }
    const delta = ((current - previous) / previous) * 100;
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}% vs previous period`;
  })();

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>Earnings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.totalCard}>
          <View style={StyleSheet.absoluteFill}>
            <GradientRect />
          </View>
          <View style={styles.totalTopRow}>
            <View style={styles.totalTextWrap}>
              <Text style={styles.totalLabel}>Total Earnings</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalEarnings)}</Text>
            </View>
            <View style={styles.totalIconCircle}>
              <TrendUpIcon size={32} color="#ffffff" />
            </View>
          </View>
          <View style={styles.totalDeltaRow}>
            <TrendUpIcon size={16} color="#ffffff" />
            <Text style={styles.totalDelta}>{trendDeltaText}</Text>
          </View>
        </View>

        <View style={styles.segmentWrap}>
          {RANGE_OPTIONS.map((segment) => {
            const isActive = segment.key === selectedRange;
            return (
              <Pressable
                key={segment.key}
                onPress={() => onRangeChange(segment.key)}
                style={[styles.segment, isActive && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {segment.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Trend</Text>
          <LineChart data={trend.map((t) => ({ label: t.label, value: t.value }))} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Vehicle-wise Earnings</Text>
          <BarChart data={vehicleWise.map((t) => ({ label: t.label, value: t.value }))} />
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendUpIcon size={16} color="#22c55e" />
              <Text style={styles.metricLabel}>Income</Text>
            </View>
            <Text style={styles.metricValue}>{formatCurrency(earnings?.summary?.totalCredit ?? 0)}</Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendUpIcon size={16} color="#ef4444" />
              <Text style={styles.metricLabel}>Deductions</Text>
            </View>
            <Text style={[styles.metricValue, styles.metricNegative]}>
              {formatCurrency(earnings?.summary?.totalDebit ?? 0)}
            </Text>
          </View>
        </View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable style={styles.exportButton}>
            <DownloadIcon size={16} color="#22c55e" />
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((item, index) => {
            const negative = item.direction === 'DEBIT';
            return (
              <TransactionRow
                key={item._id || `${item.type}-${index}`}
                title={item.description || item.type || 'Transaction'}
                amount={`${negative ? '' : '+'}${formatCurrency(item.amount ?? 0)}`}
                negative={negative}
                date={formatShortDate(item.createdAt)}
              />
            );
          })
        ) : (
          <TransactionRow title="No recent transactions" amount="₹0" />
        )}

        <GradientButton
          label="Request Payout"
          onPress={onRequestPayout}
          style={styles.cta}
          height={56}
          radius={12}
          rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
        />
      </ScrollView>

      <BottomTabs active="earnings" onTabPress={onTabPress} />
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  totalCard: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 8,
    overflow: 'hidden',
    minHeight: 148,
  },
  totalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalTextWrap: {
    flex: 1,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  totalValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  totalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  totalDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalDelta: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  segmentWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segment: {
    height: 29,
    paddingHorizontal: 9,
    borderRadius: 16,
    minWidth: 63,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#ffffff',
  },
  segmentText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    lineHeight: 20,
  },
  segmentTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  chartCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    gap: 16,
  },
  chartTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
  emptyChart: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 40,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    gap: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  metricValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  metricNegative: {
    color: '#ef4444',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
  exportButton: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exportText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconWrapNegative: {
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  txBody: { flex: 1, gap: 4 },
  txTitle: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    lineHeight: 20,
  },
  txDate: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  txAmount: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
    lineHeight: 24,
  },
  txNegative: {
    color: '#ef4444',
  },
  cta: {
    marginTop: 0,
  },
});
