import { useWindowDimensions } from 'react-native';

const DESIGN_SURFACE_WIDTH = 390;
const DESIGN_SURFACE_HEIGHT = 844;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const round = (value: number) => Math.round(value);

export type ResponsiveLayout = {
  screenWidth: number;
  screenHeight: number;
  scale: number;
  isCompact: boolean;
  isWide: boolean;
  screenX: number;
  authCardWidth: number;
  authContentWidth: number;
  brandLogoWidth: number;
  brandLogoHeight: number;
  brandTitleSize: number;
  brandTitleCompactSize: number;
  otpBoxSize: number;
  otpBoxGap: number;
  keypadMinHeight: number;
  tabBarHeight: number;
  tabIconWrapSize: number;
  tabIconSize: number;
  tabLabelSize: number;
  pageTitleSize: number;
  pageSubtitleSize: number;
  buttonHeight: number;
  inputHeight: number;
  cardPadding: number;
};

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();
  const scale = width / DESIGN_SURFACE_WIDTH;

  const screenX = clamp(round(width * 0.07), 16, 28);
  const authCardWidth = clamp(round(width - screenX * 2), 300, 390);
  const authContentWidth = clamp(round(width - screenX * 2), 300, 430);

  return {
    screenWidth: width,
    screenHeight: height,
    scale,
    isCompact: width < 360,
    isWide: width >= 430,
    screenX,
    authCardWidth,
    authContentWidth,
    brandLogoWidth: clamp(round(156 * clamp(scale, 0.9, 1.12)), 132, 176),
    brandLogoHeight: clamp(round(92 * clamp(scale, 0.9, 1.12)), 78, 104),
    brandTitleSize: clamp(round(30 * clamp(scale, 0.9, 1.08)), 26, 34),
    brandTitleCompactSize: clamp(round(26 * clamp(scale, 0.9, 1.08)), 22, 30),
    otpBoxSize: clamp(round(width * 0.12), 40, 52),
    otpBoxGap: clamp(round(width * 0.03), 8, 12),
    keypadMinHeight: clamp(round(height * 0.26), 208, 280),
    tabBarHeight: clamp(round(height * 0.084), 60, 76),
    tabIconWrapSize: clamp(round(width * 0.075), 26, 32),
    tabIconSize: clamp(round(width * 0.05), 18, 22),
    tabLabelSize: clamp(round(width * 0.028), 10, 12),
    pageTitleSize: clamp(round(width * 0.055), 20, 24),
    pageSubtitleSize: clamp(round(width * 0.033), 12, 14),
    buttonHeight: clamp(round(height * 0.062), 48, 56),
    inputHeight: clamp(round(height * 0.062), 48, 56),
    cardPadding: clamp(round(width * 0.045), 14, 20),
  };
}

export function scaleSize(size: number, screenWidth: number): number {
  const ratio = screenWidth / DESIGN_SURFACE_WIDTH;
  return round(size * clamp(ratio, 0.85, 1.15));
}

export function scaleFont(size: number, screenWidth: number): number {
  const ratio = screenWidth / DESIGN_SURFACE_WIDTH;
  return round(size * clamp(ratio, 0.9, 1.1));
}

export { DESIGN_SURFACE_WIDTH, DESIGN_SURFACE_HEIGHT };
