import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import {
  ArrowLeftIcon,
  ActivityIcon,
  BatteryIcon,
  CheckIcon,
  LocationPinIcon,
  PlusIcon,
  RupeeIcon,
  StarIcon,
  TrendUpIcon,
} from '../components/OwnerIcons';
import { StationItem, VehicleItem } from '../services/ownerApi';
import { formatCurrency } from '../utils/format';

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const formatStatusLabel = (status?: string) =>
  (status || 'DRAFT')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

export function VehicleDetailsScreen({
  onBack,
  onOpenMap,
  onRemove,
  onTabPress,
  onAddVehicle,
  showRemoveModal = false,
  showRemoveSuccess = false,
  vehicle,
  stations = [],
}: {
  onBack: () => void;
  onGoHome: () => void;
  onOpenMap: () => void;
  onRemove: () => void;
  onOpenProfile: () => void;
  onAddVehicle?: () => void;
  onTabPress: (tab: TabKey) => void;
  showRemoveModal?: boolean;
  showRemoveSuccess?: boolean;
  vehicle?: VehicleItem | null;
  stations?: StationItem[];
}) {
  const status = (vehicle?.status || 'DRAFT').toUpperCase();
  const isMaintenance = status === 'MAINTENANCE';
  const performance = vehicle?.performance;
  const recentRideHistory = vehicle?.recentRideHistory || [];
  const averageRating = performance?.averageRating;
  const statusMessage =
    status === 'MAINTENANCE'
      ? 'Vehicle is in maintenance mode'
      : status === 'ACTIVE'
        ? 'Vehicle is available for rides'
        : status === 'IN_RIDE'
          ? 'Vehicle is currently on a ride'
          : status === 'PENDING_APPROVAL'
            ? 'Waiting for approval from the backend'
            : status === 'DRAFT'
              ? 'Draft vehicle not submitted yet'
              : 'Vehicle status updated from backend';

  const stationName =
    vehicle?.station?.name ||
    stations.find((station) => station._id === vehicle?.stationId)?.name ||
    vehicle?.locationLabel ||
    'Station not assigned';

  const imageUrl = vehicle?.photos?.frontUrl || vehicle?.photos?.sideUrl;

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.back} hitSlop={10}>
          <ArrowLeftIcon size={24} color="#101828" />
        </Pressable>
        <Text style={styles.heading}>Vehicle Details</Text>
        {onAddVehicle ? (
          <Pressable style={styles.addButton} onPress={onAddVehicle}>
            <PlusIcon size={16} color="#fc4c02" />
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        ) : (
          <View style={styles.addButtonPlaceholder} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.vehicleImageCard}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.vehicleImage} resizeMode="cover" />
          ) : (
            <Text style={styles.vehicleEmoji}>🛵</Text>
          )}
        </View>

        <View style={styles.heroText}>
          <Text style={styles.vehicleName}>{vehicle?.modelName || 'Vehicle name'}</Text>
          <Text style={styles.vehicleReg}>
            {vehicle?.registrationNumber || 'Registration number'}
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={isMaintenance ? styles.pillMaintenance : styles.pillActive}>
            <Text
              style={
                isMaintenance ? styles.pillTextMaintenance : styles.pillTextActive
              }
            >
              {formatStatusLabel(vehicle?.status)}
            </Text>
          </View>
          <View style={styles.statusMeta}>
            <Text style={styles.statusMetaLabel}>Current State</Text>
            <Text style={styles.statusMetaValue}>{statusMessage}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              icon={<BatteryIcon size={24} color="#fc4c02" />}
              value={
                vehicle?.batteryPercent != null ? `${vehicle.batteryPercent}%` : 'N/A'
              }
              label="Battery Level"
            />
            <StatCard
              icon={<TrendUpIcon size={24} color="#22c55e" />}
              value={averageRating != null ? averageRating.toFixed(1) : '—'}
              label="Performance"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={<RupeeIcon size={24} color="#0f172a" />}
              value={formatCurrency(performance?.revenue || 0)}
              label="Total Earnings"
            />
            <StatCard
              icon={<StarIcon size={24} color="#fc4c02" />}
              value={String(performance?.totalRides || 0)}
              label="Total Rides"
            />
          </View>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <LocationPinIcon size={20} color="#fc4c02" />
            <Text style={styles.cardTitle}>Current Location</Text>
          </View>
          <Text style={styles.locationName}>{stationName}</Text>
          <Pressable style={styles.mapButton} onPress={onOpenMap}>
            <LocationPinIcon size={16} color="#fc4c02" />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.cardTitle}>Recent Rides</Text>
          <Text style={styles.viewAll}>Recent history</Text>
        </View>
        {recentRideHistory.length > 0 ? (
          recentRideHistory.map((ride) => (
            <View key={ride.rideId} style={styles.rideCard}>
              <View style={styles.rideTopRow}>
                <Text style={styles.rideName} numberOfLines={1}>
                  {ride.riderName || ride.rideId}
                </Text>
                <Text style={styles.rideAmount}>{formatCurrency(ride.fare || 0)}</Text>
              </View>
              <View style={styles.rideMiddleRow}>
                <Text style={styles.rideDate}>{ride.dateLabel || '—'}</Text>
                <Text style={styles.rideDuration}>
                  {ride.durationMinutes != null ? `${ride.durationMinutes} mins` : '—'}
                </Text>
              </View>
              <View style={styles.rideRatingRow}>
                <ActivityIcon size={16} color="#fc4c02" />
                <Text style={styles.rideRating}>{ride.status || 'Ride'}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyRideCard}>
            <Text style={styles.emptyRideTitle}>No completed rides yet</Text>
            <Text style={styles.emptyRideText}>
              Ride history will appear here once this vehicle starts serving bookings.
            </Text>
          </View>
        )}

        <Pressable style={styles.removeButton} onPress={onRemove}>
          <Text style={styles.removeButtonText}>Remove Vehicle</Text>
        </Pressable>
      </ScrollView>

      {showRemoveSuccess ? (
        <View style={styles.toast} pointerEvents="none">
          <View style={styles.toastIcon}>
            <CheckIcon size={12} color="#ffffff" />
          </View>
          <Text style={styles.toastText}>Vehicle removed successfully</Text>
        </View>
      ) : null}

      <BottomTabs active="scooty" onTabPress={onTabPress} />

      {showRemoveModal ? (
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onBack} />
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Remove Vehicle?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove {vehicle?.modelName || 'this vehicle'}? This
              action cannot be undone.
            </Text>
            <Pressable style={styles.modalDanger} onPress={onRemove}>
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
  addButtonPlaceholder: {
    width: 74,
    height: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  vehicleImageCard: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleEmoji: { fontSize: 72 },
  heroText: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    gap: 4,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 32,
    textAlign: 'center',
  },
  vehicleReg: {
    fontSize: 16,
    color: '#0f172a',
    lineHeight: 24,
    textAlign: 'center',
  },
  statusCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  pillActive: {
    borderRadius: 999,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillTextActive: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  pillMaintenance: {
    borderRadius: 999,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillTextMaintenance: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  toggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  toggle: {
    width: 32,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
    padding: 1,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#fc4c02',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  statusMeta: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  statusMetaLabel: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  statusMetaValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'right',
  },
  statsGrid: {
    gap: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    height: 116,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  statLabel: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  locationCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 27,
  },
  locationName: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
  },
  mapButton: {
    height: 36,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(248,250,252,0.38)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapButtonText: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    color: '#fc4c02',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  rideCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    marginBottom: 16,
  },
  rideTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  rideAmount: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  rideMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideDate: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  rideDuration: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  rideRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyRideCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 4,
  },
  emptyRideTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyRideText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
  },
  rideRating: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButtonsWrap: {
    gap: 12,
  },
  requestMaintenanceButton: {
    height: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  requestMaintenanceText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  removeButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.162,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(248,250,252,0.46)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modal: {
    width: '100%',
    maxWidth: 343,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    padding: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 18,
    textAlign: 'center',
  },
  modalText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalDanger: {
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDangerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  modalCancel: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  toast: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    minWidth: 253,
    height: 37,
    borderRadius: 12,
    borderWidth: 1.162,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  toastIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});
