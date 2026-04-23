import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ArrowLeftIcon,
  BatteryIcon,
  BatteryLowIcon,
  LocationPinIcon,
  PlusIcon,
  RupeeIcon,
  SearchIcon,
  StarIcon,
} from '../components/OwnerIcons';
import { StationItem, VehicleItem } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

type VehicleFilter = 'ALL' | 'ACTIVE' | 'IN_RIDE' | 'CHARGING' | 'MAINTENANCE';

const FILTERS: Array<{ key: VehicleFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'IN_RIDE', label: 'In Ride' },
  { key: 'CHARGING', label: 'Charging' },
  { key: 'MAINTENANCE', label: 'Repair' },
];

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  IN_RIDE: 'In Ride',
  CHARGING: 'Charging',
  MAINTENANCE: 'Maintenance',
  DRAFT: 'Draft',
  PENDING: 'Pending',
};

export function VehicleListScreen({
  onBack,
  onOpenDetails,
  onAddVehicle,
  onTabPress,
  vehicles = [],
  stations = [],
}: {
  onBack: () => void;
  onOpenDetails: (vehicleId: string) => void;
  onOpenProfile: () => void;
  onOpenEarnings: () => void;
  onOpenAlerts: () => void;
  onAddVehicle: () => void;
  onTabPress: (tab: TabKey) => void;
  vehicles?: VehicleItem[];
  stations?: StationItem[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<VehicleFilter>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      const statusMatch = selectedFilter === 'ALL' || v.status === selectedFilter;
      if (!statusMatch) return false;
      if (!needle) return true;
      return (
        (v.modelName || '').toLowerCase().includes(needle) ||
        (v.registrationNumber || '').toLowerCase().includes(needle)
      );
    });
  }, [vehicles, selectedFilter, query]);

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>My Vehicles</Text>
        <Pressable style={styles.addButton} onPress={onAddVehicle}>
          <PlusIcon size={16} color="#fc4c02" />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <SearchIcon size={20} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search vehicles..."
            placeholderTextColor="#64748b"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.tabsShell}>
        <View style={styles.tabsRow}>
          {FILTERS.map((filter) => {
            const isActive = filter.key === selectedFilter;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length > 0 ? (
          filtered.map((vehicle) => {
            const stationName =
              vehicle.station?.name ||
              stations.find((station) => station._id === vehicle.stationId)?.name ||
              vehicle.locationLabel ||
              '—';
            const battery = vehicle.batteryPercent;
            const isMaintenance = vehicle.status === 'MAINTENANCE';
            const pillStyle = isMaintenance ? styles.statusPillMaintenance : styles.statusPill;
            const pillTextStyle = isMaintenance ? styles.statusPillTextMaintenance : styles.statusPillText;
            const statusLabel =
              STATUS_LABELS[vehicle.status || ''] || vehicle.status || 'Draft';

            return (
              <Pressable
                key={vehicle._id}
                style={styles.card}
                onPress={() => onOpenDetails(vehicle._id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.vehicleName} numberOfLines={1}>
                      {vehicle.modelName || 'Vehicle'}
                    </Text>
                    <Text style={styles.vehicleReg} numberOfLines={1}>
                      {vehicle.registrationNumber || '—'}
                    </Text>
                  </View>
                  <View style={pillStyle}>
                    <Text style={pillTextStyle}>{statusLabel}</Text>
                  </View>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statRow}>
                    <VehicleStat
                      icon={
                        battery != null && battery <= 20 ? (
                          <BatteryLowIcon size={16} color="#ef4444" />
                        ) : (
                          <BatteryIcon size={16} color="#64748b" />
                        )
                      }
                      label="Battery"
                      value={battery != null ? `${battery}%` : 'N/A'}
                    />
                    <VehicleStat
                      icon={<LocationPinIcon size={16} color="#fc4c02" />}
                      label="Station"
                      value={stationName}
                    />
                  </View>
                  <View style={styles.statRow}>
                    <VehicleStat
                      icon={<RupeeIcon size={16} color="#64748b" />}
                      label="Earnings"
                      value={formatCurrency(vehicle.earnings || 0)}
                    />
                    <VehicleStat
                      icon={<StarIcon size={16} color="#0f172a" />}
                      label="Rating"
                      value={vehicle.rating != null ? String(vehicle.rating) : '—'}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'ALL'
                ? 'No vehicles yet'
                : `No ${selectedFilter.toLowerCase().replace('_', ' ')} vehicles`}
            </Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'ALL'
                ? 'Add your first scooty and submit it for approval.'
                : 'Try another filter or update the vehicle status from the detail screen.'}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomTabs active="scooty" onTabPress={onTabPress} />
    </View>
  );
}

function VehicleStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIconWrap}>{icon}</View>
      <View style={styles.statTextWrap}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
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
  addButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchRow: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.43)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 16,
    paddingVertical: 0,
  },
  tabsShell: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    padding: 2,
  },
  tab: {
    flex: 1,
    height: 29,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
    lineHeight: 16,
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  vehicleName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  vehicleReg: {
    marginTop: 2,
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  statusPill: {
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPillText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  statusPillMaintenance: {
    borderWidth: 1.162,
    borderColor: 'rgba(239,68,68,0.2)',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusPillTextMaintenance: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  statsGrid: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIconWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextWrap: {
    flex: 1,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  statValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  emptyCard: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 6,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 17,
  },
});
