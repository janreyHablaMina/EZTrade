import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type ChevronDownProps = {
  open?: boolean;
};

export function ChevronDown({ open = false }: ChevronDownProps) {
  return (
    <View style={open ? { transform: [{ rotate: '180deg' }] } : undefined}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 9l6 6 6-6"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
