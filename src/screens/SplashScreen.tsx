import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';

type SlideKind = 'brand' | 'fleet' | 'earn';

type Slide = {
  kind: SlideKind;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    kind: 'brand',
    title: 'Slydo Mobility',
    subtitle: 'Owner Portal — power your fleet',
  },
  {
    kind: 'fleet',
    title: 'Manage your fleet',
    subtitle: 'Add, track and assign scooties from anywhere',
  },
  {
    kind: 'earn',
    title: 'Earn in real time',
    subtitle: 'Watch every ride, every rupee, every payout',
  },
];

const SLIDE_DURATION = 1200;

export function SplashScreen() {
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(28)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    slideUp.setValue(28);
    scale.setValue(0.6);
    pulse.setValue(0);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ]).start();

    const t = setTimeout(() => {
      if (index < SLIDES.length - 1) {
        Animated.timing(fade, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start(() => setIndex((i) => i + 1));
      }
    }, SLIDE_DURATION);

    return () => clearTimeout(t);
  }, [index]);

  const slide = SLIDES[index];

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1.6],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.45, 0.2, 0],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.hero,
            { opacity: fade, transform: [{ translateY: slideUp }, { scale }] },
          ]}
        >
          <View style={styles.iconWrap}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
              ]}
            />
            <View style={styles.iconBadge}>
              <SlideIcon kind={slide.kind} />
            </View>
          </View>

          <Animated.Text style={styles.title}>{slide.title}</Animated.Text>
          <Animated.Text style={styles.subtitle}>{slide.subtitle}</Animated.Text>
        </Animated.View>

        <View style={styles.indicatorRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.indicator, i === index && styles.indicatorActive]}
            />
          ))}
        </View>

        <Animated.Text style={styles.footer}>Slydo Mobility</Animated.Text>
      </View>
    </SafeAreaView>
  );
}

function SlideIcon({ kind }: { kind: SlideKind }) {
  if (kind === 'brand') {
    return (
      <Svg width={88} height={88} viewBox="0 0 64 64" fill="none">
        <Defs>
          <SvgLinearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#fc4c02" />
            <Stop offset="100%" stopColor="#ff7a45" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={6} y={6} width={52} height={52} rx={14} fill="url(#brandGrad)" />
        <Path
          d="M22 30 L32 18 L42 30 M28 30 V46 H36 V30"
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (kind === 'fleet') {
    return (
      <Svg width={92} height={92} viewBox="0 0 72 64" fill="none">
        <Defs>
          <SvgLinearGradient id="fleetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#fc4c02" />
            <Stop offset="100%" stopColor="#ff7a45" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={2} y={6} width={68} height={52} rx={26} fill="url(#fleetGrad)" opacity={0.14} />
        <Circle cx={18} cy={46} r={5} stroke="#fc4c02" strokeWidth={2.4} />
        <Circle cx={42} cy={46} r={5} stroke="#fc4c02" strokeWidth={2.4} />
        <Path
          d="M18 40 L24 24 H32 M30 46 H36 M24 24 L32 36 H42 L40 46"
          stroke="#fc4c02"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={58} cy={20} r={4} fill="#16a34a" />
        <Path d="M58 16 V12 M58 28 V24" stroke="#16a34a" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={88} height={88} viewBox="0 0 64 64" fill="none">
      <Defs>
        <SvgLinearGradient id="earnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#16a34a" />
          <Stop offset="100%" stopColor="#22c55e" />
        </SvgLinearGradient>
      </Defs>
      <Circle cx={32} cy={32} r={30} fill="url(#earnGrad)" opacity={0.14} />
      <Rect
        x={10}
        y={36}
        width={8}
        height={18}
        rx={2}
        fill="#16a34a"
        opacity={0.75}
      />
      <Rect x={22} y={26} width={8} height={28} rx={2} fill="#16a34a" />
      <Rect
        x={34}
        y={18}
        width={8}
        height={36}
        rx={2}
        fill="#16a34a"
        opacity={0.75}
      />
      <Rect x={46} y={12} width={8} height={42} rx={2} fill="#16a34a" />
      <Polyline
        points="12,42 26,32 38,26 50,18"
        stroke="#fc4c02"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(252, 76, 2, 0.18)',
  },
  iconBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fc4c02',
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#101828',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  indicatorRow: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#fc4c02',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(15, 23, 42, 0.45)',
    letterSpacing: 1.5,
  },
});
