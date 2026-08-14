import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

type CheckIconProps = {
  size?: number;
  color?: string;
};

export function CheckIcon({
  size = 24,
  color = colors.green,
}: CheckIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
