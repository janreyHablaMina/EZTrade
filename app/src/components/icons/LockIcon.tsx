import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

type LockIconProps = {
  size?: number;
  color?: string;
};

export function LockIcon({
  size = 24,
  color = 'rgba(255,255,255,0.4)',
}: LockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="11"
        width="14"
        height="11"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
