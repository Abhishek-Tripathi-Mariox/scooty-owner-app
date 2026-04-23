import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { GradientButton } from '../components/GradientButton';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from '../components/OwnerIcons';
import { StationItem, VehicleItem } from '../services/ownerApi';

export function MapViewScreen({
  onBack,
  onTabPress,
  onAddVehicle,
  vehicle,
  stations = [],
}: {
  onBack: () => void;
  onGoHome: () => void;
  onTabPress: (tab: TabKey) => void;
  onAddVehicle?: () => void;
  vehicle?: VehicleItem | null;
  stations?: StationItem[];
}) {
  const parseCoordinate = (value?: number | string | null) => {
    if (value == null || value === '') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const coordinates = vehicle?.location?.coordinates;
  const latitude = parseCoordinate(coordinates?.[1]);
  const longitude = parseCoordinate(coordinates?.[0]);
  const locationAvailable = latitude !== null && longitude !== null;

  const locationName =
    vehicle?.station?.name ||
    stations.find((station) => station._id === vehicle?.stationId)?.name ||
    vehicle?.locationLabel ||
    'Unknown location';

  const openInMaps = async () => {
    if (!locationAvailable || latitude == null || longitude == null) {
      Alert.alert('Location not available', 'This vehicle does not have valid coordinates yet.');
      return;
    }
    const query = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `maps://maps.apple.com/?q=${query}`,
      android: `geo:${latitude},${longitude}?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error('No maps app available');
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open map', 'Please install a maps application or try again.');
    }
  };

  return (
    <View style={styles.root}>
      <AppBackground variant="auth" />

      <View style={styles.mapArea}>
        <View style={styles.blockA} />
        <View style={styles.blockB} />
        <View style={styles.blockC} />
        <View style={styles.blockD} />
        <View style={styles.route} />
        <View style={styles.pinLarge} />
        <View style={styles.pinSmall1} />
        <View style={styles.pinSmall2} />
        <View style={styles.pinSmall3} />
        <View style={styles.pinSmall4} />
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelTitle}>{vehicle?.modelName || 'Vehicle'}</Text>
          <Text style={styles.mapLabelSub}>{locationName}</Text>
          {locationAvailable ? (
            <Text style={styles.mapLabelCoords}>
              {`Lat ${latitude?.toFixed(4)} · Lon ${longitude?.toFixed(4)}`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.topbar} pointerEvents="box-none">
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
          <View style={styles.addPlaceholder} />
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <GradientButton
          label="Request to Stop"
          onPress={openInMaps}
          height={48}
          radius={12}
          rightIcon={<ArrowRightIcon size={16} color="#ffffff" />}
          style={styles.primaryButton}
        />
      </View>

      <BottomTabs active="scooty" onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  topbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
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
  addPlaceholder: {
    width: 74,
    height: 32,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#d9e8eb',
    position: 'relative',
    overflow: 'hidden',
  },
  blockA: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '35%',
    height: '26%',
    backgroundColor: '#efe5c5',
    opacity: 0.9,
  },
  blockB: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '34%',
    height: '30%',
    backgroundColor: '#c7d6e6',
    opacity: 0.9,
  },
  blockC: {
    position: 'absolute',
    left: '28%',
    top: '30%',
    width: '42%',
    height: '35%',
    backgroundColor: '#e9e3c1',
    opacity: 0.9,
  },
  blockD: {
    position: 'absolute',
    right: '8%',
    bottom: '10%',
    width: '30%',
    height: '24%',
    backgroundColor: '#cfe2c7',
    opacity: 0.9,
  },
  route: {
    position: 'absolute',
    left: '10%',
    top: '45%',
    right: '10%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#fc4c02',
  },
  pinLarge: {
    position: 'absolute',
    left: '45%',
    top: '48%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fc4c02',
    borderWidth: 4,
    borderColor: '#fff',
  },
  pinSmall1: {
    position: 'absolute',
    left: '20%',
    top: '22%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#84cc16',
  },
  pinSmall2: {
    position: 'absolute',
    right: '18%',
    top: '22%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f59e0b',
  },
  pinSmall3: {
    position: 'absolute',
    left: '14%',
    bottom: '18%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f59e0b',
  },
  pinSmall4: {
    position: 'absolute',
    right: '12%',
    bottom: '18%',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#84cc16',
  },
  mapLabel: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 80,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  mapLabelTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  mapLabelSub: {
    marginTop: 2,
    color: '#64748b',
    fontSize: 12,
    lineHeight: 16,
  },
  mapLabelCoords: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fc4c02',
    backgroundColor: 'rgba(253,254,249,0.67)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fc4e05',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  primaryButton: {
    flex: 1,
  },
});
