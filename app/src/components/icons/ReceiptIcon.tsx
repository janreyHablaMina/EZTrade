import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

export function ReceiptIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3.5h10a1.5 1.5 0 011.5 1.5v15.2l-2.1-1.3-2.1 1.3-2.3-1.3-2.3 1.3-2.1-1.3-2.1 1.3V5A1.5 1.5 0 017 3.5z"
        stroke={colors.white}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M9 8h6M9 12h6M9 16h3.5"
        stroke={colors.white}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
