import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Polyline,
  Stop,
} from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

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

const SLIDE_DURATION = 1300;
const ENTER_MS = 560;
const EXIT_MS = 300;

export function SplashScreen() {
  const [index, setIndex] = useState(0);
  const enter = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const ambient = useRef(new Animated.Value(0)).current;
  const orbA = useRef(new Animated.Value(0)).current;
  const orbB = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ambient, {
        toValue: 1,
        duration: 6000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(orbA, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(orbB, {
        toValue: 1,
        duration: 7500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [ambient, orbA, orbB]);

  useEffect(() => {
    enter.setValue(0);
    exit.setValue(0);

    Animated.timing(enter, {
      toValue: 1,
      duration: ENTER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(progress, {
      toValue: index + 1,
      duration: SLIDE_DURATION - EXIT_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const t = setTimeout(() => {
      if (index < SLIDES.length - 1) {
        Animated.timing(exit, {
          toValue: 1,
          duration: EXIT_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => setIndex((i) => i + 1));
      }
    }, SLIDE_DURATION);

    return () => clearTimeout(t);
  }, [index]);

  const slide = SLIDES[index];

  const heroOpacity = Animated.multiply(
    enter,
    exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
  );
  const heroTranslate = Animated.add(
    enter.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
    exit.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }),
  );
  const progressWidth = progress.interpolate({
    inputRange: [0, SLIDES.length],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <AppBackground variant="auth" />

      <DriftingOrbs orbA={orbA} orbB={orbB} />
      <FloatingParticles />

      <View style={styles.brandMark}>
        <View style={styles.brandMarkDot} />
        <Text style={styles.brandMarkText}>SLYDO MOBILITY · OWNER</Text>
        <View style={styles.brandMarkLine} />
      </View>

      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.heroStage,
            { opacity: heroOpacity, transform: [{ translateX: heroTranslate }] },
          ]}
        >
          {slide.kind === 'brand' ? (
            <BrandSlide ambient={ambient} enter={enter} />
          ) : null}
          {slide.kind === 'fleet' ? <FleetSlide enter={enter} /> : null}
          {slide.kind === 'earn' ? <EarnSlide enter={enter} /> : null}
        </Animated.View>

        <View style={styles.textBlock}>
          <StaggeredTitle key={slide.kind} title={slide.title} />
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: enter.interpolate({
                  inputRange: [0, 0.55, 1],
                  outputRange: [0, 0, 1],
                }),
                transform: [
                  {
                    translateY: enter.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {slide.subtitle}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.footerArea}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.indicator, i === index && styles.indicatorActive]}
            />
          ))}
        </View>
        <Text style={styles.footerHint}>
          {index === SLIDES.length - 1 ? 'Almost there…' : 'Setting up your portal'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ----------------------------- Slide 1 — Brand ---------------------------- */

function BrandSlide({
  ambient,
  enter,
}: {
  ambient: Animated.Value;
  enter: Animated.Value;
}) {
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [orbit]);

  const rotation = orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const burst = ambient.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.96, 1.04, 0.96],
  });
  const haloScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  const wordmark = 'SLYDO';
  const letters = wordmark.split('');
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      45,
      letterAnims.map((a) =>
        Animated.spring(a, {
          toValue: 1,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [letterAnims]);

  return (
    <View style={styles.brandSlide}>
      <Animated.View
        style={[styles.halo, { transform: [{ scale: Animated.multiply(haloScale, burst) }] }]}
      >
        <Svg width={280} height={280} viewBox="0 0 280 280" fill="none">
          <Defs>
            <SvgLinearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#fc4c02" stopOpacity={0.45} />
              <Stop offset="50%" stopColor="#fc4c02" stopOpacity={0.18} />
              <Stop offset="100%" stopColor="#fc4c02" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx={140} cy={140} r={140} fill="url(#haloGrad)" />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.orbitWrap, { transform: [{ rotate: rotation }] }]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 130;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const palette = ['#fc4c02', '#ff7a45', '#16a34a', '#fc4c02', '#22c55e', '#ff7a45'];
          return (
            <View
              key={i}
              style={[
                styles.orbitDot,
                {
                  backgroundColor: palette[i],
                  transform: [{ translateX: x }, { translateY: y }],
                },
              ]}
            />
          );
        })}
      </Animated.View>

      <View style={styles.wordmarkStack}>
        <View style={styles.wordmarkRow}>
          {letters.map((ch, i) => {
            const a = letterAnims[i];
            const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
            const scale = a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
            return (
              <Animated.Text
                key={i}
                style={[
                  styles.wordmarkLetter,
                  { opacity: a, transform: [{ translateY }, { scale }] },
                ]}
              >
                {ch}
              </Animated.Text>
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.ownerBadge,
            { opacity: enter.interpolate({ inputRange: [0.4, 1], outputRange: [0, 1] }) },
          ]}
        >
          <Text style={styles.ownerBadgeText}>OWNER PORTAL</Text>
        </Animated.View>
      </View>
    </View>
  );
}

/* ----------------------------- Slide 2 — Fleet ---------------------------- */

function FleetSlide({ enter }: { enter: Animated.Value }) {
  const live = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(live, {
        toValue: 1,
        duration: 1600,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ).start();
  }, [live]);

  const pulse = live.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.3, 1],
  });
  const pulseOp = live.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  // Three scooter pins arranged in a triangle around the central station
  const positions = [
    { x: 0, y: -90 },
    { x: -82, y: 50 },
    { x: 82, y: 50 },
  ];

  const pinAnims = useRef(positions.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      120,
      pinAnims.map((a) =>
        Animated.spring(a, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [pinAnims]);

  return (
    <View style={styles.fleetSlide}>
      {/* Background connecting lines */}
      <Svg
        width={260}
        height={260}
        viewBox="-130 -130 260 260"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={`M 0 -90 L 0 0 M -82 50 L 0 0 M 82 50 L 0 0`}
          stroke="#fc4c02"
          strokeWidth={1.2}
          strokeDasharray="3 4"
          opacity={0.45}
        />
      </Svg>

      {/* Central station hub */}
      <Animated.View
        style={[
          styles.stationHub,
          {
            transform: [
              {
                scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
              },
            ],
          },
        ]}
      >
        <Svg width={70} height={70} viewBox="0 0 64 64" fill="none">
          <Defs>
            <SvgLinearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#fc4c02" />
              <Stop offset="100%" stopColor="#ff7a45" />
            </SvgLinearGradient>
          </Defs>
          <Circle cx={32} cy={32} r={28} fill="url(#hubGrad)" />
          <Path
            d="M22 28 L32 18 L42 28 M28 28 V44 H36 V28"
            stroke="#ffffff"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.stationGlow,
            { transform: [{ scale: pulse }], opacity: pulseOp },
          ]}
        />
      </Animated.View>

      {/* Three scooter pins */}
      {positions.map((pos, i) => {
        const a = pinAnims[i];
        const translateX = a.interpolate({ inputRange: [0, 1], outputRange: [0, pos.x] });
        const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [0, pos.y] });
        const labels = ['S-01', 'S-02', 'S-03'];
        return (
          <Animated.View
            key={i}
            style={[
              styles.scooterPin,
              {
                opacity: a,
                transform: [{ translateX }, { translateY }, { scale: a }],
              },
            ]}
          >
            <View style={styles.scooterPinHead}>
              <Svg width={28} height={20} viewBox="0 0 64 44" fill="none">
                <Circle cx={12} cy={32} r={6} stroke="#fc4c02" strokeWidth={3} />
                <Circle cx={48} cy={32} r={6} stroke="#fc4c02" strokeWidth={3} />
                <Path
                  d="M12 26 L20 10 H28 M28 32 H34 M20 10 L32 24 H48"
                  stroke="#fc4c02"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.scooterPinTag}>
              <View
                style={[
                  styles.scooterPinTagDot,
                  { backgroundColor: i === 0 ? '#16a34a' : i === 1 ? '#fc4c02' : '#16a34a' },
                ]}
              />
              <Text style={styles.scooterPinTagText}>{labels[i]}</Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

/* ----------------------------- Slide 3 — Earn ----------------------------- */

function EarnSlide({ enter }: { enter: Animated.Value }) {
  const bars = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;
  const trend = useRef(new Animated.Value(0)).current;
  const rupeeA = useRef(new Animated.Value(0)).current;
  const rupeeB = useRef(new Animated.Value(0)).current;
  const counter = useRef(new Animated.Value(0)).current;
  const [counterValue, setCounterValue] = useState(0);

  useEffect(() => {
    Animated.stagger(
      80,
      bars.map((a) =>
        Animated.spring(a, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [bars]);

  useEffect(() => {
    Animated.timing(trend, {
      toValue: 1,
      duration: 900,
      delay: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(rupeeA, {
        toValue: 1,
        duration: 1600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(rupeeB, {
        toValue: 1,
        duration: 1900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ).start();

    Animated.timing(counter, {
      toValue: 1840,
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const id = counter.addListener(({ value }) => {
      setCounterValue(Math.round(value));
    });
    return () => counter.removeListener(id);
  }, [trend, rupeeA, rupeeB, counter]);

  const heights = [60, 90, 75, 110, 130];

  const trendDraw = trend.interpolate({
    inputRange: [0, 1],
    outputRange: [220, 0],
  });

  const rupeeAY = rupeeA.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const rupeeAOp = rupeeA.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 1, 0.5, 0],
  });
  const rupeeBY = rupeeB.interpolate({ inputRange: [0, 1], outputRange: [0, -70] });
  const rupeeBOp = rupeeB.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 1, 0.5, 0],
  });

  return (
    <View style={styles.earnSlide}>
      {/* Earnings counter card */}
      <Animated.View
        style={[
          styles.earnCard,
          {
            opacity: enter,
            transform: [
              { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) },
            ],
          },
        ]}
      >
        <Text style={styles.earnCardLabel}>TODAY</Text>
        <View style={styles.earnCardValueRow}>
          <Text style={styles.earnCardRupee}>₹</Text>
          <Text style={styles.earnCardAmount}>
            {counterValue.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.earnTrendRow}>
          <View style={styles.earnTrendUp} />
          <Text style={styles.earnTrendText}>+12.4% vs yesterday</Text>
        </View>
      </Animated.View>

      {/* Chart */}
      <View style={styles.chart}>
        {bars.map((a, i) => {
          const h = a.interpolate({ inputRange: [0, 1], outputRange: [0, heights[i]] });
          return (
            <View key={i} style={styles.barCol}>
              <Animated.View
                style={[
                  styles.bar,
                  i === 3 || i === 4
                    ? { backgroundColor: '#fc4c02' }
                    : { backgroundColor: 'rgba(252, 76, 2, 0.4)' },
                  { height: h },
                ]}
              />
            </View>
          );
        })}

        {/* Trend line overlay */}
        <Svg
          width={220}
          height={140}
          viewBox="0 0 220 140"
          style={styles.trendOverlay}
        >
          <Polyline
            points="20,90 60,68 100,76 150,40 200,18"
            stroke="#16a34a"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="220"
            strokeDashoffset={trendDraw as unknown as number}
          />
          <Circle cx={200} cy={18} r={4} fill="#16a34a" />
        </Svg>
      </View>

      {/* Floating rupees */}
      <Animated.Text
        style={[
          styles.floatingRupee,
          { left: 30, top: 60, opacity: rupeeAOp, transform: [{ translateY: rupeeAY }] },
        ]}
      >
        +₹120
      </Animated.Text>
      <Animated.Text
        style={[
          styles.floatingRupee,
          { right: 30, top: 90, opacity: rupeeBOp, transform: [{ translateY: rupeeBY }] },
        ]}
      >
        +₹95
      </Animated.Text>
    </View>
  );
}

/* ------------------------------- Shared bits ------------------------------ */

function StaggeredTitle({ title }: { title: string }) {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.spring(reveal, {
      toValue: 1,
      friction: 7,
      tension: 110,
      useNativeDriver: true,
    }).start();
  }, [title, reveal]);

  const translateY = reveal.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Animated.Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[styles.titleChar, { opacity: reveal, transform: [{ translateY }] }]}
    >
      {title}
    </Animated.Text>
  );
}

function DriftingOrbs({
  orbA,
  orbB,
}: {
  orbA: Animated.Value;
  orbB: Animated.Value;
}) {
  const aX = orbA.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-30, 30, -30],
  });
  const aY = orbA.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-20, 20, -20],
  });
  const bX = orbB.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [25, -25, 25],
  });
  const bY = orbB.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [15, -25, 15],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <Animated.View
        style={[styles.orb, styles.orbA, { transform: [{ translateX: aX }, { translateY: aY }] }]}
      />
      <Animated.View
        style={[styles.orb, styles.orbB, { transform: [{ translateX: bX }, { translateY: bY }] }]}
      />
    </View>
  );
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: 3 + ((i * 7) % 8),
  startX: (i * 71) % SCREEN_W,
  startY: 80 + ((i * 113) % (SCREEN_H - 220)),
  delay: (i * 230) % 2200,
  duration: 4400 + ((i * 311) % 2200),
  amp: 18 + ((i * 9) % 24),
  color:
    i % 3 === 0
      ? 'rgba(252, 76, 2, 0.42)'
      : i % 3 === 1
        ? 'rgba(34, 197, 94, 0.36)'
        : 'rgba(255, 255, 255, 0.7)',
}));

function FloatingParticles() {
  const anims = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    PARTICLES.forEach((p, i) => {
      const animate = () => {
        anims[i].setValue(0);
        Animated.timing(anims[i], {
          toValue: 1,
          duration: p.duration,
          delay: p.delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }).start(animate);
      };
      animate();
    });
  }, [anims]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {PARTICLES.map((p, i) => {
        const translateY = anims[i].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -p.amp, 0],
        });
        const opacity = anims[i].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.15, 0.9, 0.15],
        });
        return (
          <Animated.View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.startX,
              top: p.startY,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: [{ translateY }],
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },

  orb: { position: 'absolute', width: 320, height: 320, borderRadius: 160 },
  orbA: { top: -80, left: -100, backgroundColor: 'rgba(252, 76, 2, 0.18)' },
  orbB: { bottom: -90, right: -110, backgroundColor: 'rgba(34, 197, 94, 0.16)' },

  brandMark: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMarkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fc4c02',
  },
  brandMarkText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(15, 23, 42, 0.6)',
    letterSpacing: 3,
  },
  brandMarkLine: {
    width: 22,
    height: 1.5,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    borderRadius: 1,
  },

  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heroStage: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  textBlock: { marginTop: 36, alignItems: 'center' },
  titleChar: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },

  /* Brand slide */
  brandSlide: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
  orbitWrap: {
    position: 'absolute',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  wordmarkStack: { alignItems: 'center', justifyContent: 'center' },
  wordmarkRow: { flexDirection: 'row' },
  wordmarkLetter: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fc4c02',
    letterSpacing: 3,
    textShadowColor: 'rgba(252, 76, 2, 0.25)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
  },
  ownerBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
  },
  ownerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2.5,
  },

  /* Fleet slide */
  fleetSlide: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationHub: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fc4c02',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  stationGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(252, 76, 2, 0.25)',
  },
  scooterPin: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  scooterPinHead: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(252, 76, 2, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fc4c02',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  scooterPinTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(252, 76, 2, 0.18)',
  },
  scooterPinTagDot: { width: 6, height: 6, borderRadius: 3 },
  scooterPinTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },

  /* Earn slide */
  earnSlide: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  earnCard: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(252, 76, 2, 0.2)',
    shadowColor: '#fc4c02',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    alignItems: 'center',
  },
  earnCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(15, 23, 42, 0.55)',
    letterSpacing: 2,
  },
  earnCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  earnCardRupee: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fc4c02',
    marginRight: 4,
  },
  earnCardAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  earnTrendRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  earnTrendUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#16a34a',
  },
  earnTrendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  chart: {
    width: 220,
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barCol: { width: 22, alignItems: 'center' },
  bar: { width: 18, borderRadius: 8 },
  trendOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  floatingRupee: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '800',
    color: '#16a34a',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  /* Footer */
  footerArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 48,
  },
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fc4c02',
    borderRadius: 2,
  },
  indicatorRow: { flexDirection: 'row', gap: 8 },
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
  footerHint: {
    fontSize: 11,
    color: 'rgba(15, 23, 42, 0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
