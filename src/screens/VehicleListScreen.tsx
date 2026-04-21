import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
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

export function VehicleListScreen({
  onBack,
  onOpenDetails,
  onOpenProfile,
  onOpenEarnings,
  onOpenAlerts,
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
  const filtered = useMemo(
    () => (selectedFilter === 'ALL' ? vehicles : vehicles.filter((vehicle) => vehicle.status === selectedFilter)),
    [vehicles, selectedFilter],
  );
  const filterCounts = useMemo(
    () =>
      vehicles.reduce(
        (acc, vehicle) => {
          acc.ALL += 1;
          if (vehicle.status === 'ACTIVE') acc.ACTIVE += 1;
          if (vehicle.status === 'IN_RIDE') acc.IN_RIDE += 1;
          if (vehicle.status === 'CHARGING') acc.CHARGING += 1;
          if (vehicle.status === 'MAINTENANCE') acc.MAINTENANCE += 1;
          return acc;
        },
        { ALL: 0, ACTIVE: 0, IN_RIDE: 0, CHARGING: 0, MAINTENANCE: 0 },
      ),
    [vehicles],
  );

  return (
    <View style={styles.root}>
      <PageFrame
        title="My Vehicles"
        onBack={onBack}
        topRight={<Text style={styles.add} onPress={onAddVehicle}>+ Add</Text>}
        scroll={false}
      >
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput placeholder="Search vehicles..." placeholderTextColor="#9ca3af" style={styles.searchInput} />
        </View>

        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const isActive = filter.key === selectedFilter;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                style={[styles.filterChip, isActive && styles.filterActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label} ({filterCounts[filter.key]})
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {filtered.length > 0 ? (
            filtered.map((vehicle) => {
              const stationName =
                vehicle.station?.name ||
                stations.find((station) => station._id === vehicle.stationId)?.name ||
                vehicle.locationLabel ||
                'Not assigned';
              const thumbUrl = vehicle.photos?.frontUrl || vehicle.photos?.sideUrl;

              return (
                <Pressable key={vehicle._id} style={styles.card} onPress={() => onOpenDetails(vehicle._id)}>
                  {thumbUrl ? (
                    <Image source={{ uri: thumbUrl }} style={styles.vehicleThumbnail} resizeMode="cover" />
                  ) : null}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.vehicleName}>{vehicle.modelName || 'Vehicle'}</Text>
                      <Text style={styles.vehicleReg}>{vehicle.registrationNumber || 'No registration number'}</Text>
                    </View>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>{vehicle.status || 'DRAFT'}</Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <VehicleStat label="Battery" value={vehicle.batteryPercent != null ? `${vehicle.batteryPercent}%` : 'N/A'} />
                    <VehicleStat label="Station" value={stationName} />
                  </View>
                  <View style={styles.statsRow}>
                    <VehicleStat label="Earnings" value={formatCurrency((vehicle as any).earnings || 0)} />
                    <VehicleStat label="Rating" value={(vehicle as any).rating ? String((vehicle as any).rating) : '—'} />
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {selectedFilter === 'ALL' ? 'No vehicles yet' : `No ${selectedFilter.toLowerCase().replace('_', ' ')} vehicles`}
              </Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'ALL'
                  ? 'Add your first scooty and submit it for approval.'
                  : 'Try another filter or update the vehicle status from the detail screen.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </PageFrame>
      <BottomTabs
        active="scooty"
        onTabPress={onTabPress}
      />
    </View>
  );
}

function VehicleStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  add: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchRow: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 14, color: '#9ca3af', marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 13, paddingVertical: 0 },
  filters: { flexDirection: 'row', marginTop: 10, marginBottom: 10},
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  filterActive: { backgroundColor: COLORS.button },
  filterText: { fontSize: 10, color: COLORS.textPrimary },
  filterTextActive: { color: '#fff', fontWeight: '800' },
  list: { paddingBottom: 14 },
  card: {
    marginBottom: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  vehicleThumbnail: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: COLORS.cardBorder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vehicleName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  vehicleReg: { marginTop: 2, color: COLORS.textSecondary, fontSize: 11 },
  statusPill: {
    backgroundColor: '#fff4ef',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { color: COLORS.button, fontSize: 10, fontWeight: '800' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  stat: {
    width: '48%',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statLabel: { fontSize: 10, color: COLORS.textSecondary },
  statValue: { marginTop: 4, fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  emptyCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '900' },
  emptyText: { marginTop: 6, color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
});
