import Svg, {
  Defs,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from 'react-native-svg';
import { colors } from '../theme/colors';

type BrandLogoProps = {
  size?: number;
};

export function BrandLogo({ size = 96 }: BrandLogoProps) {
  const cx = 50;
  const cy = 50;
  const r = 38;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#818cf8" />
          <Stop offset="40%" stopColor="#a855f7" />
          <Stop offset="100%" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="hexFill" x1="20%" y1="0%" x2="80%" y2="100%">
          <Stop offset="0%" stopColor="#1e0b45" />
          <Stop offset="100%" stopColor="#0a041c" />
        </LinearGradient>
        <LinearGradient id="markFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" />
          <Stop offset="100%" stopColor="#ddd6fe" />
        </LinearGradient>
      </Defs>

      <Polygon
        points={hex}
        fill="url(#hexFill)"
        stroke="url(#hexStroke)"
        strokeWidth={5}
      />

      {/* Angular geometric mark (stylized EZ) */}
      <Path
        d="M31 29 L69 29 L69 39 L48 39 L69 58 L69 71 L31 71 L31 61 L52 61 L31 42 Z"
        fill="url(#markFill)"
      />
    </Svg>
  );
}
