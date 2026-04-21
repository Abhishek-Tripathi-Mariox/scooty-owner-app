import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { PageFrame } from '../components/PageFrame';
import { COLORS } from '../constants/theme';
import { StationItem, VehicleItem } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function VehicleDetailsScreen({
  onBack,
  onGoHome,
  onOpenMap,
  onRemove,
  onOpenProfile,
  onTabPress,
  showRemoveModal = false,
  vehicle,
  stations = [],
}: {
  onBack: () => void;
  onGoHome: () => void;
  onOpenMap: () => void;
  onRemove: () => void;
  onOpenProfile: () => void;
  onTabPress: (tab: TabKey) => void;
  showRemoveModal?: boolean;
  vehicle?: VehicleItem | null;
  stations?: StationItem[];
}) {
  const isMaintenance = vehicle?.status === 'MAINTENANCE';
  const stationName =
    vehicle?.station?.name ||
    stations.find((station) => station._id === vehicle?.stationId)?.name ||
    vehicle?.locationLabel ||
    'Station not assigned';

  const parseCoordinate = (value?: number | string | null) => {
    if (value == null || value === '') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const coordinates = vehicle?.location?.coordinates;
  const latitude = parseCoordinate(coordinates?.[1]);
  const longitude = parseCoordinate(coordinates?.[0]);
  const hasCoordinates = latitude !== null && longitude !== null;

  const imageUrl = vehicle?.photos?.frontUrl || vehicle?.photos?.sideUrl;

  return (
    <View style={styles.root}>
      <PageFrame title="Vehicle Details" onBack={onBack} topRight={<Text style={styles.add}>+ Add</Text>} scroll={false}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.vehicleImageContent} resizeMode="cover" />
              ) : (
                <Text style={styles.vehicleEmoji}>🛵</Text>
              )}
            </View>
            <Text style={styles.vehicleName}>{vehicle?.modelName || 'Vehicle name'}</Text>
            <Text style={styles.vehicleReg}>{vehicle?.registrationNumber || 'Registration number'}</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={[styles.pill, isMaintenance ? styles.pillMaintenance : styles.pillActive]}>
              <Text style={[styles.pillText, isMaintenance ? styles.pillTextMaintenance : styles.pillTextActive]}>
                {isMaintenance ? 'Maintenance' : 'Active'}
              </Text>
            </View>
            <Text style={styles.toggleText}>Mark Maintenance</Text>
            <View style={[styles.toggle, isMaintenance && styles.toggleOn]}>
              <View style={[styles.toggleThumb, isMaintenance && styles.toggleThumbOn]} />
            </View>
          </View>

          <View style={styles.grid}>
            <Stat label="Battery Level" value={vehicle?.batteryPercent != null ? `${vehicle.batteryPercent}%` : 'N/A'} />
            <Stat label="Performance" value="4.8" />
            <Stat label="Total Earnings" value={formatCurrency((vehicle as any)?.earnings || 0)} />
            <Stat label="Total Rides" value={String((vehicle as any)?.totalRides || 0)} />
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>Current Location</Text>
            <Text style={styles.locationName}>{stationName}</Text>
            {hasCoordinates ? (
              <Text style={styles.locationCoordinates}>{`Lat: ${latitude?.toFixed(6)} • Lon: ${longitude?.toFixed(6)}`}</Text>
            ) : null}
            <Pressable style={styles.mapButton} onPress={onOpenMap}>
              <Text style={styles.mapButtonText}>View on Map</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Rides</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          <View style={styles.rideCard}>
            <View>
              <Text style={styles.rideTitle}>No ride history loaded</Text>
              <Text style={styles.rideDate}>Backend ride history can be wired in next.</Text>
              <Text style={styles.rideSub}>★ 5.0</Text>
            </View>
            <View style={styles.rideRight}>
              <Text style={styles.rideAmount}>₹0</Text>
              <Text style={styles.rideTime}>0 mins</Text>
            </View>
          </View>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Request Maintenance</Text>
          </Pressable>

          <Pressable style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.removeButtonText}>Remove Vehicle</Text>
          </Pressable>
        </ScrollView>
      </PageFrame>

      <BottomTabs
        active="scooty"
        onTabPress={onTabPress}
      />

      {showRemoveModal ? (
        <View style={styles.overlay}>
          <View style={styles.backdrop} />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Remove Vehicle?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove {vehicle?.modelName || 'this vehicle'}? This action cannot be undone.
            </Text>
            <Pressable style={styles.modalDanger} onPress={onBack}>
              <Text style={styles.modalDangerText}>Remove</Text>
            </Pressable>
            <Pressable style={styles.modalCancel} onPress={onBack}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
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
  content: { paddingBottom: 14 },
  vehicleCard: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  vehicleImage: {
    width: '100%',
    height: 122,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  vehicleImageContent: {
    width: '100%',
    height: '100%',
  },
  vehicleEmoji: { fontSize: 54 },
  vehicleName: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '900' },
  vehicleReg: { marginTop: 4, color: COLORS.textSecondary, fontSize: 11.5 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.74)',
    marginBottom: 12,
  },
  pill: {
    minWidth: 72,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: '#eef6ff',
    borderColor: '#d6e4f8',
  },
  pillMaintenance: {
    backgroundColor: '#fff4ef',
    borderColor: '#ffd4c4',
  },
  pillText: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  pillTextActive: { color: COLORS.textPrimary },
  pillTextMaintenance: { color: COLORS.button },
  toggleText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#d8dee7',
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: COLORS.button,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    width: '48.5%',
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.74)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  statLabel: { fontSize: 10, color: COLORS.textSecondary },
  statValue: { marginTop: 5, fontSize: 15, color: COLORS.textPrimary, fontWeight: '900' },
  locationCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '900' },
  locationName: { marginTop: 6, color: COLORS.textSecondary, fontSize: 12 },
  mapButton: {
    marginTop: 12,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: { color: COLORS.button, fontSize: 12, fontWeight: '800' },
  locationCoordinates: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  viewAll: { fontSize: 12, color: COLORS.button, fontWeight: '800' },
  rideCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rideTitle: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  rideDate: { marginTop: 4, fontSize: 11, color: COLORS.textSecondary, maxWidth: 180 },
  rideSub: { marginTop: 4, fontSize: 11, color: COLORS.textPrimary },
  rideRight: { alignItems: 'flex-end' },
  rideAmount: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  rideTime: { marginTop: 4, fontSize: 11, color: COLORS.textSecondary },
  secondaryButton: {
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
  secondaryButtonText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '800' },
  removeButton: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff8686',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  removeButtonText: { color: '#ef4444', fontSize: 12, fontWeight: '800' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  modal: {
    width: '86%',
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  modalText: { marginTop: 8, fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  modalDanger: {
    marginTop: 12,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDangerText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  modalCancel: {
    marginTop: 10,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 12 },
});
