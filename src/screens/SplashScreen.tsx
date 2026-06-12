import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { AppBackground } from '../components/AppBackground';
import { FONTS } from '../constants/fonts';
import ArrowRight from '../assets/splash/arrow-right.svg';
import ScootyIcon from '../assets/splash/scooty-icon.svg';

const HeroArt = require('../assets/splash/hero-art.png');
const SlydoLogo = require('../assets/images/slydo-logo-upright.png');

const PHASE_0_BLANK_MS = 350;
const PHASE_1_LOGO_IN_MS = 650;
const PHASE_1_HOLD_MS = 250;
const PHASE_2_TILT_MS = 750;
const PHASE_2_HOLD_MS = 400;
const PHASE_3_UNTILT_MS = 600;
const PHASE_3_HOLD_MS = 300;
const PHASE_4_FADE_IN_MS = 600;
const PHASE_4_HOLD_MS = 700;
const PHASE_5_FADE_MS = 700;

export function SplashScreen({ onGetStarted }: { onGetStarted?: () => void }) {
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => makeStyles(width, height), [width, height]);

  const introOpacity = useRef(new Animated.Value(0)).current;
  const introScale = useRef(new Animated.Value(0.45)).current;
  const introRotate = useRef(new Animated.Value(0)).current;
  const slydoOpacity = useRef(new Animated.Value(0)).current;
  const slydoScale = useRef(new Animated.Value(0.9)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.7)).current;
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(PHASE_0_BLANK_MS),

      // Phase 1: small upright logo fades in
      Animated.parallel([
        Animated.timing(introOpacity, {
          toValue: 1,
          duration: PHASE_1_LOGO_IN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(introScale, {
          toValue: 0.6,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(PHASE_1_HOLD_MS),

      // Phase 2: tilt to diamond + scale up
      Animated.parallel([
        Animated.timing(introRotate, {
          toValue: 1,
          duration: PHASE_2_TILT_MS,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(introScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(PHASE_2_HOLD_MS),

      // Phase 3: rotate back upright + scale down
      Animated.parallel([
        Animated.timing(introRotate, {
          toValue: 0,
          duration: PHASE_3_UNTILT_MS,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(introScale, {
          toValue: 0.6,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(PHASE_3_HOLD_MS),

      // Phase 4: intro logo fully fades OUT → blank pause → Slydo Mobility fades IN
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: PHASE_4_FADE_IN_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(slydoOpacity, {
          toValue: 1,
          duration: PHASE_4_FADE_IN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(slydoScale, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(PHASE_4_HOLD_MS),

      // Phase 5: Slydo Mobility fully fades out, then hero (Splash 6) fades in
      Animated.timing(slydoOpacity, {
        toValue: 0,
        duration: PHASE_5_FADE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: PHASE_5_FADE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(heroScale, {
          toValue: 1,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      if (finished) setHeroReady(true);
    });
  }, [introOpacity, introScale, introRotate, slydoOpacity, slydoScale, heroOpacity, heroScale]);

  const introRotateDeg = introRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdebd6" />

      <AppBackground variant="splash" />

      {/* Phase 1-3: centered logo intro / diamond tilt */}
      <Animated.View
        style={[styles.centerStage, { opacity: introOpacity }]}
        pointerEvents="none"
      >
        <Animated.Image
          source={SlydoLogo}
          style={[
            styles.introLogo,
            { transform: [{ scale: introScale }, { rotate: introRotateDeg }] },
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Phase 4: Slydo Mobility horizontal */}
      <Animated.View
        style={[
          styles.centerStage,
          { opacity: slydoOpacity, transform: [{ scale: slydoScale }] },
        ]}
        pointerEvents="none"
      >
        <View style={styles.slydoRow}>
          <Image source={SlydoLogo} style={styles.slydoLogo} resizeMode="contain" />
          <View style={styles.slydoTextWrap}>
            <Text style={styles.slydoTitle} numberOfLines={1}>
              Slydo
            </Text>
            <Text style={styles.slydoSubtitle} numberOfLines={1}>
              Mobility
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Hero scene — Splash 6 — rendered LAST so it sits on top of everything */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: heroOpacity, transform: [{ scale: heroScale }] },
        ]}
        pointerEvents={heroReady ? 'box-none' : 'none'}
      >
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        >
          <Defs>
            <SvgLinearGradient id="splashBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#fc8f1b" />
              <Stop offset="50%" stopColor="#ff6d0c" />
              <Stop offset="100%" stopColor="#f3550a" />
            </SvgLinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#splashBg)" />
        </Svg>

        <SafeAreaView style={styles.heroSafe}>
          <View style={styles.heroWrap}>
            <Image source={HeroArt} style={styles.heroImage} resizeMode="contain" />
          </View>

          <View style={styles.bottomBlock}>
            <Text style={styles.heading} adjustsFontSizeToFit numberOfLines={4}>
              <Text style={styles.headingRegular}>Turn your </Text>
              <Text style={styles.headingBold}>scooties</Text>
              <Text style={styles.headingRegular}> into a profitable business with </Text>
              <Text style={styles.headingAccent}>Slydo</Text>
            </Text>

            <Text style={styles.subtitle} numberOfLines={2}>
              List your vehicles, monitor performance, and earn from every ride.
            </Text>

            <Pressable
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
              onPress={heroReady ? onGetStarted : undefined}
              disabled={!heroReady}
            >
              <View style={styles.ctaIconCircle}>
                <ScootyIcon
                  width={styles.ctaIconCircle.width * 0.66}
                  height={styles.ctaIconCircle.height * 0.56}
                />
              </View>
              <View style={styles.ctaTextRow}>
                <Text style={styles.ctaText} numberOfLines={1}>
                  Swipe to get started
                </Text>
                <ArrowRight width={24} height={24} />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function makeStyles(width: number, height: number) {
  const isShort = height < 700;
  const introLogoSize = Math.min(width * 0.55, height * 0.3);
  const slydoLogoSize = Math.min(width * 0.22, 100);
  const titleSize = Math.min(width * 0.1, 42);
  const subtitleSize = Math.min(width * 0.034, 14);
  const heroSize = Math.min(width * 0.82, height * 0.38);
  const ctaHeight = Math.min(width * 0.17, 70);
  const ctaPad = 4;
  const ctaIconSize = ctaHeight - ctaPad * 2;

  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#fdebd6',
    },
    centerStage: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    introLogo: {
      width: introLogoSize,
      height: introLogoSize,
    },
    slydoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Math.min(width * 0.035, 16),
      paddingHorizontal: 20,
    },
    slydoLogo: {
      width: slydoLogoSize,
      height: slydoLogoSize,
    },
    slydoTextWrap: {
      justifyContent: 'center',
    },
    slydoTitle: {
      color: '#0f172a',
      fontFamily: FONTS.bold,
      fontSize: titleSize,
      fontWeight: '800',
      letterSpacing: 0.2,
      lineHeight: titleSize * 1.1,
    },
    slydoSubtitle: {
      marginTop: 2,
      color: 'rgba(15,23,42,0.55)',
      fontFamily: FONTS.medium,
      fontSize: subtitleSize,
      fontWeight: '600',
      letterSpacing: 1.8,
      textTransform: 'uppercase',
    },
    heroSafe: {
      flex: 1,
    },
    heroWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: isShort ? height * 0.04 : height * 0.06,
    },
    heroImage: {
      width: heroSize,
      height: heroSize,
    },
    bottomBlock: {
      paddingHorizontal: 22,
      paddingBottom: Platform.OS === 'android' ? 32 : 20,
    },
    heading: {
      color: '#ffffff',
      fontSize: isShort ? 28 : 34,
      lineHeight: isShort ? 38 : 46,
      marginBottom: 12,
      fontFamily: FONTS.regular,
    },
    headingRegular: {
      fontWeight: '400',
    },
    headingBold: {
      fontWeight: '800',
      fontFamily: FONTS.bold,
    },
    headingAccent: {
      fontWeight: '800',
      fontFamily: FONTS.bold,
      color: '#ffe8d5',
    },
    subtitle: {
      color: '#ffffff',
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 20,
      fontFamily: FONTS.regular,
    },
    cta: {
      height: ctaHeight,
      borderRadius: ctaHeight / 2,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.62)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: ctaPad,
      overflow: 'hidden',
    },
    ctaPressed: {
      opacity: 0.85,
    },
    ctaIconCircle: {
      width: ctaIconSize,
      height: ctaIconSize,
      borderRadius: ctaIconSize / 2,
      backgroundColor: '#fc8c1a',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 9.5,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
    },
    ctaTextRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    ctaText: {
      color: '#ffffff',
      fontSize: 17,
      fontWeight: '500',
      fontFamily: FONTS.medium,
    },
  });
}
