import React from 'react';
import Svg, { Circle, Path, Polyline, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

export function ArrowLeftIcon({ size = 24, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5m0 0 6 6m-6-6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 16, color = '#ffffff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14m0 0-6-6m6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = '#1E293B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.909 21.2869C11.5679 21.2861 11.2297 21.2851 10.8915 21.284C9.92546 21.2808 8.95936 21.2768 7.99332 21.2716C6.98016 21.2663 5.89163 21.2596 4.79625 21.2476C4.66322 21.2461 4.53033 21.2434 4.39749 21.2407C4.12233 21.2349 3.8625 21.2295 3.60197 21.2355C3.16641 21.2455 2.65988 21.2146 2.20749 20.9106C1.89685 20.7018 1.6531 20.38 1.52114 20.0044C1.2098 19.1183 1.68788 18.4211 2.03691 17.9119C2.07483 17.8566 2.11247 17.8017 2.14875 17.7471C2.85605 16.6813 3.34918 15.4524 3.57483 14.1934C3.71564 13.4073 3.7576 12.6113 3.80199 11.7685C3.82758 11.2824 3.85407 10.7798 3.90136 10.2805C3.9758 9.49425 4.09754 8.81836 4.27346 8.21414C4.92005 5.99306 6.62602 4.13602 8.83688 3.24642C10.8928 2.41917 13.2329 2.43122 15.257 3.27942C15.8689 3.53588 16.4383 3.86353 16.9492 4.25334C17.9293 5.00124 18.7548 6.02963 19.2736 7.149C19.8635 8.4217 20.0394 9.80081 20.1267 10.8601C20.1552 11.2058 20.177 11.5547 20.1981 11.8921C20.2538 12.7832 20.3065 13.6248 20.4726 14.4521C20.6565 15.3688 20.9798 16.2512 21.4335 17.0748C21.4926 17.1821 21.5603 17.2952 21.6405 17.4206C21.7356 17.5695 21.8348 17.715 21.9398 17.8691C22.0166 17.9817 22.0934 18.0946 22.1689 18.209C22.5753 18.825 22.6789 19.429 22.4768 20.0044C22.3447 20.3801 22.1009 20.7018 21.7903 20.9105C21.3379 21.2146 20.8311 21.2455 20.3959 21.2355C20.1352 21.2295 19.8755 21.2348 19.6004 21.2406C19.4675 21.2434 19.3346 21.2461 19.2016 21.2475C18.1062 21.2595 17.0176 21.2662 16.0045 21.2716C14.9871 21.277 14.0119 21.2812 13.1062 21.2839C12.6042 21.2855 12.1896 21.2863 11.909 21.2869ZM3.84235 19.8736C4.03993 19.8736 4.23502 19.8777 4.42575 19.8816C4.55414 19.8843 4.68258 19.887 4.81116 19.8884C5.90321 19.9004 6.98944 19.907 8.00063 19.9124C8.96574 19.9175 9.93089 19.9215 10.896 19.9247C11.2337 19.9258 11.5715 19.9268 11.9093 19.9276C12.1867 19.927 12.6008 19.9262 13.1022 19.9247C14.0069 19.922 14.981 19.9178 15.9973 19.9124C17.0085 19.907 18.0947 19.9004 19.1868 19.8884C19.3154 19.887 19.4438 19.8843 19.5722 19.8816C19.8498 19.8759 20.1369 19.8699 20.4271 19.8765C20.6366 19.8814 20.8945 19.8749 21.0322 19.7823C21.1003 19.7366 21.1593 19.6533 21.1943 19.5538C21.2186 19.4848 21.2753 19.3231 21.0344 18.9578C20.9626 18.849 20.8895 18.7418 20.8166 18.6348C20.7106 18.4793 20.601 18.3185 20.4952 18.1528C20.3989 18.0022 20.3165 17.8642 20.2429 17.7308C19.7223 16.7856 19.3511 15.7725 19.1399 14.7196C18.9557 13.8019 18.8977 12.8743 18.8415 11.9771C18.8208 11.6462 18.7994 11.3041 18.772 10.9718C18.6939 10.0247 18.5402 8.79914 18.0404 7.72074C17.6128 6.79805 16.9324 5.95045 16.1247 5.33409C15.7057 5.01441 15.2371 4.74497 14.7318 4.53323C13.0348 3.82214 11.0713 3.81281 9.34444 4.50759C7.51744 5.24269 6.10969 6.77034 5.57878 8.59411C5.4271 9.11513 5.32116 9.70866 5.25488 10.4086C5.21025 10.8796 5.18457 11.3678 5.15968 11.84C5.11505 12.6874 5.06888 13.5636 4.91307 14.4332C4.65493 15.8736 4.09079 17.2795 3.28154 18.4988C3.2415 18.5591 3.20007 18.6196 3.15825 18.6806C2.86107 19.1141 2.72921 19.3416 2.80379 19.5538C2.83875 19.6533 2.89782 19.7366 2.96583 19.7823C3.10355 19.8749 3.3616 19.8813 3.57108 19.8765C3.66179 19.8744 3.75235 19.8736 3.84235 19.8736Z"
        fill={color}
      />
      <Path
        d="M12 23.9997C10.1293 23.9997 8.60742 22.4778 8.60742 20.6072H9.9668C9.9668 21.7283 10.8789 22.6403 12 22.6403C13.121 22.6403 14.0331 21.7283 14.0331 20.6072H15.3925C15.3925 22.4778 13.8706 23.9997 12 23.9997Z"
        fill={color}
      />
      <Path
        d="M15.1827 3.24033H13.8233C13.8233 2.23467 13.0052 1.41656 11.9995 1.41656C10.9939 1.41656 10.1758 2.23472 10.1758 3.24033H8.81641C8.81641 1.48514 10.2444 0.0571861 11.9995 0.0571861C13.7547 0.0571861 15.1827 1.48514 15.1827 3.24033Z"
        fill={color}
      />
    </Svg>
  );
}

export function TrendUpIcon({ size = 24, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TrendDownIcon({ size = 24, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7l6 6 4-4 8 8m0 0h-5m5 0v-5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WalletIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 7H5a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h13v4zM3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={17} cy={14} r={1.2} fill={color} />
    </Svg>
  );
}

export function CarIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 13l2-6a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 6v5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={7.5} cy={14.5} r={1.2} fill={color} />
      <Circle cx={16.5} cy={14.5} r={1.2} fill={color} />
    </Svg>
  );
}

export function CheckCircleIcon({ size = 20, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Polyline points="8.5,12.5 11,15 15.5,9.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function ActivityIcon({ size = 20, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h3l3-8 4 16 3-8h5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WrenchIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18v3h3l6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.1-2.1 2.6-2.4z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AlertCircleIcon({ size = 20, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path d="M12 8v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={16.5} r={0.9} fill={color} />
    </Svg>
  );
}

export function RupeeIcon({ size = 16, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 4h12M6 9h12M8 4c3 0 5 2 5 4.5S11 13 8 13h-2l8 8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PlusIcon({ size = 22, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14m-7-7h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function DownloadIcon({ size = 16, color = '#22c55e' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v12m0 0l-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraIcon({ size = 40, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M14 16h4l2-3h8l2 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={24} cy={24} r={5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function ClockIcon({ size = 16, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function UploadArrowIcon({ size = 32, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v12m0-12-4 4m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ size = 20, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.8} />
      <Path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function BatteryIcon({ size = 16, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={7} width={17} height={10} rx={2} stroke={color} strokeWidth={1.6} />
      <Rect x={20} y={10} width={2} height={4} rx={0.5} fill={color} />
    </Svg>
  );
}

export function BatteryLowIcon({ size = 16, color = '#ef4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={7} width={17} height={10} rx={2} stroke={color} strokeWidth={1.6} />
      <Rect x={20} y={10} width={2} height={4} rx={0.5} fill={color} />
      <Rect x={4} y={9} width={3} height={6} rx={0.5} fill={color} />
    </Svg>
  );
}

export function LocationPinIcon({ size = 16, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={9} r={2.5} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 3z"
        fill={color}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 20, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color = '#ffffff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12l4.5 4.5L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MailIcon({ size = 16, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} stroke={color} strokeWidth={1.6} />
      <Path d="M4 7l8 6 8-6" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PhoneCallIcon({ size = 16, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L9 10.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6A2 2 0 0 1 22 17"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MessageIcon({ size = 16, color = '#0f172a' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12a8 8 0 0 1-12 6.9L3 20l1.1-5.9A8 8 0 1 1 21 12z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PencilIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BankIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10l9-6 9 6" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 10v7M9 10v7M15 10v7M19 10v7" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M3 19h18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function SquarePenIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CreditCardIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={2}
        y={5}
        width={20}
        height={14}
        rx={2}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M2 10h20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M6 15h4" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function DocumentFileIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14 3v6h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 13h8M8 17h5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function SettingsIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.6} />
      <Path
        d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HelpIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path
        d="M9.2 9a3 3 0 1 1 5.4 2c-.9.6-2 1-2 2v.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx={12.5} cy={17} r={0.9} fill={color} />
    </Svg>
  );
}

export function LogoutIcon({ size = 16, color = '#ef4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldCheckIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GlobeIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = '#64748b' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function SendIcon({ size = 16, color = '#ffffff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function InfoIcon({ size = 20, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Path d="M12 16v-5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={8.2} r={0.9} fill={color} />
    </Svg>
  );
}

export function EyeIcon({ size = 16, color = '#fc4c02' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}
