import React from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PageFrame } from '../components/PageFrame';
import { BottomTabs, type TabKey } from '../components/BottomTabs';
import { COLORS } from '../constants/theme';
import { StationItem, VehicleItem } from '../services/ownerApi';

export function MapViewScreen({
  onBack,
  onGoHome,
  onTabPress,
  vehicle,
  stations = [],
}: {
  onBack: () => void;
  onGoHome: () => void;
  onTabPress: (tab: TabKey) => void;
  vehicle?: VehicleItem | null;
  stations?: StationItem[];
}) {
  const locationName =
    vehicle?.station?.name ||
    stations.find((station) => station._id === vehicle?.stationId)?.name ||
    vehicle?.locationLabel ||
    'Unknown location';

  const locationAddress =
    vehicle?.station?.address ||
    stations.find((station) => station._id === vehicle?.stationId)?.address;

  const parseCoordinate = (value?: number | string | null) => {
    if (value == null || value === '') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const coordinates = vehicle?.location?.coordinates;
  const latitude = parseCoordinate(coordinates?.[1]);
  const longitude = parseCoordinate(coordinates?.[0]);
  const locationAvailable = latitude !== null && longitude !== null;

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
    } catch (error) {
      Alert.alert('Unable to open map', 'Please install a maps application or try again.');
    }
  };

  return (
    <View style={styles.root}>
      <PageFrame title="Vehicle Location" onBack={onBack} scroll={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{vehicle?.modelName || 'Vehicle location'}</Text>
          <Text style={styles.summarySubtitle}>{vehicle?.registrationNumber || 'Registration not available'}</Text>
          <Text style={styles.summaryText}>{locationAvailable ? locationName : 'Current vehicle location is not available.'}</Text>
          {locationAddress ? <Text style={styles.summaryAddress}>{locationAddress}</Text> : null}
          {locationAvailable ? (
            <Text style={styles.summaryAddress}>{`Lat: ${latitude?.toFixed(6)} • Lon: ${longitude?.toFixed(6)}`}</Text>
          ) : null}
        </View>

        <View style={styles.map}>
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
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>
              {locationAvailable
                ? 'Tap back to return to vehicle details. Current location is shown above.'
                : 'No precise GPS coordinates available for this vehicle.'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, !locationAvailable && styles.disabledButton]} onPress={openInMaps}>
            <Text style={styles.actionButtonText}>Open in Maps</Text>
          </Pressable>
        </View>
      </PageFrame>
      <BottomTabs
        active="scooty"
        onTabPress={onTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  map: {
    flex: 1,
    minHeight: 420,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#d9e8eb',
    marginTop: 8,
    marginBottom: 12,
    position: 'relative',
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
    top: '40%',
    right: '10%',
    height: 4,
    borderRadius: 999,
    backgroundColor: COLORS.button,
    borderStyle: 'dotted',
  },
  pinLarge: {
    position: 'absolute',
    left: '45%',
    top: '44%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dc2626',
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
  summaryCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  summarySubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  summaryText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  summaryAddress: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: '800',
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  disabledButton: {
    backgroundColor: COLORS.cardBorder,
  },
  mapOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
