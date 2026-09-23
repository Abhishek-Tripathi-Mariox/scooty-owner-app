import { Image, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useStyles } from '../utils/responsiveStyles';
import { useScreenInsets } from '../utils/insets';

const HomeImage = require('../assets/images/bottom/homeimage.png');
const ScootyImage = require('../assets/images/bottom/scootyimage.png');
const AlertImage = require('../assets/images/bottom/alertimage.png');
const ProfileImage = require('../assets/images/bottom/profileimage.png');

export type TabKey = 'home' | 'scooty' | 'earnings' | 'alerts' | 'profile';

const ACTIVE_COLOR = '#fc4c02';
const INACTIVE_COLOR = '#5b6575';
const INACTIVE_LABEL = '#5b6575';

export function BottomTabs({
  active,
  onTabPress,
}: {
  active: TabKey;
  onTabPress: (tab: TabKey) => void;
}) {
  const styles = useStyles(RAW_STYLES);
  const insets = useScreenInsets();
  return (
    <View style={[styles.bar, { paddingBottom: 8 + insets.bottom }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            hitSlop={6}
          >
            <View style={styles.iconWrap}>
              {tab.key === 'earnings' ? (
                <EarningsIcon size={24} color={color} />
              ) : (
                <Image
                  source={tab.image}
                  style={[styles.iconImage, { tintColor: color }]}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? ACTIVE_COLOR : INACTIVE_LABEL },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function EarningsIcon({ size = 22, color = '#94a3b8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5.118 7.404h4.528M5.118 9.523h4.528M8.485 14.652 5.65 12.214v-.571h.16a2.119 2.119 0 0 0 0-4.239h-.69"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.775 16.319H6.92v2.431h5.855zM18.631 16.319h-5.856v2.431h5.856zM18.631 13.888h-5.856v2.431h5.856z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinejoin="round"
      />
      <Path
        d="M6.92 18.75H.75v-5.061c0-2.069.63-4.088 1.807-5.79l1.902-2.75h5.825l1.902 2.75c1.177 1.702 1.807 3.72 1.807 5.79v.388"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.631.75H3.112v.338c0 .989.241 1.963.702 2.838l.645 1.224h5.825l.645-1.224c.461-.875.702-1.85.702-2.838L11.631.75Z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const tabs: Array<{ key: TabKey; label: string; image?: number }> = [
  { key: 'home', label: 'Home', image: HomeImage },
  { key: 'scooty', label: 'Scooty', image: ScootyImage },
  { key: 'earnings', label: 'Earnings' },
  { key: 'alerts', label: 'Alerts', image: AlertImage },
  { key: 'profile', label: 'Profile', image: ProfileImage },
];

const RAW_STYLES = {
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 68,
    paddingTop: 6,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#ece3de',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  iconImage: {
    width: 26,
    height: 26,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
} as const;
