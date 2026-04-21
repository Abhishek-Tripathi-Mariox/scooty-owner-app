import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import EarningImage from '../assets/images/bottom/earningimage.svg';

const HomeImage = require('../assets/images/bottom/homeimage.png');
const ScootyImage = require('../assets/images/bottom/scootyimage.png');
const AlertImage = require('../assets/images/bottom/alertimage.png');
const ProfileImage = require('../assets/images/bottom/profileimage.png');

export type TabKey = 'home' | 'scooty' | 'earnings' | 'alerts' | 'profile';

export function BottomTabs({
  active,
  onTabPress,
}: {
  active: TabKey;
  onTabPress: (tab: TabKey) => void;
}) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => (
        <Pressable key={tab.key} style={styles.tab} onPress={() => onTabPress(tab.key)}>
          <View style={[styles.iconWrap, active === tab.key && styles.iconWrapActive]}>
            {tab.key === 'earnings' ? (
              <EarningImage width={20} height={20} />
            ) : (
              <Image source={tab.image} style={styles.iconImage} resizeMode="contain" />
            )}
          </View>
          <Text style={[styles.label, active === tab.key && styles.active]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const tabs: Array<{ key: TabKey; label: string; image?: number }> = [
  { key: 'home', label: 'Home', image: HomeImage },
  { key: 'scooty', label: 'Scooty', image: ScootyImage },
  { key: 'earnings', label: 'Earnings' },
  { key: 'alerts', label: 'Alerts', image: AlertImage },
  { key: 'profile', label: 'Profile', image: ProfileImage },
];

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#ece3de',
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(245, 133, 87, 0.12)',
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  label: {
    marginTop: 3,
    fontSize: 11,
    color: '#7b8191',
    fontWeight: '700',
  },
  active: {
    color: COLORS.button,
  },
});
