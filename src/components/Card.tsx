import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

export const cardStyles = {
  borderColor: 'rgba(46, 91, 173, 0.22)',
  dividerColor: 'rgba(46, 91, 173, 0.18)',
  radius: 4,
  contentBackground: colors.neutral,
  previewBackground: '#E5E7EB'
};

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral,
    borderRadius: cardStyles.radius,
    borderWidth: 1,
    borderColor: cardStyles.borderColor,
    overflow: 'hidden'
  }
});
