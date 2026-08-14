import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

export function CopyIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9h10v12H9z"
        stroke={colors.purpleBright}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4V3h10v1"
        stroke={colors.purpleBright}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
