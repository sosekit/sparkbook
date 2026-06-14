import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

type SearchIconProps = {
  color?: string;
  size?: number;
};

type SearchIconCircleProps = SearchIconProps & {
  circleSize?: number;
  backgroundColor?: string;
  borderColor?: string;
};

const SEARCH_PATH = 'M11.0667 12L6.86667 7.8C6.53333 8.06667 6.15 8.27778 5.71667 8.43333C5.28333 8.58889 4.82222 8.66667 4.33333 8.66667C3.12222 8.66667 2.09722 8.24722 1.25833 7.40833C0.419444 6.56944 0 5.54444 0 4.33333C0 3.12222 0.419444 2.09722 1.25833 1.25833C2.09722 0.419444 3.12222 0 4.33333 0C5.54444 0 6.56944 0.419444 7.40833 1.25833C8.24722 2.09722 8.66667 3.12222 8.66667 4.33333C8.66667 4.82222 8.58889 5.28333 8.43333 5.71667C8.27778 6.15 8.06667 6.53333 7.8 6.86667L12 11.0667L11.0667 12ZM4.33333 7.33333C5.16667 7.33333 5.875 7.04167 6.45833 6.45833C7.04167 5.875 7.33333 5.16667 7.33333 4.33333C7.33333 3.5 7.04167 2.79167 6.45833 2.20833C5.875 1.625 5.16667 1.33333 4.33333 1.33333C3.5 1.33333 2.79167 1.625 2.20833 2.20833C1.625 2.79167 1.33333 3.5 1.33333 4.33333C1.33333 5.16667 1.625 5.875 2.20833 6.45833C2.79167 7.04167 3.5 7.33333 4.33333 7.33333Z';

export function SearchIcon({ color = colors.text, size = 16 }: SearchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d={SEARCH_PATH} fill={color} transform="translate(2 2)" />
    </Svg>
  );
}

export function SearchIconCircle({
  color = colors.text,
  size = 12,
  circleSize = 24,
  backgroundColor = colors.surface,
  borderColor = '#CACACA'
}: SearchIconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor,
          borderColor
        }
      ]}
    >
      <SearchIcon color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  }
});
