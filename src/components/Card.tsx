import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';

export const cardStyles = {
  borderColor: colors.borderSoft,
  dividerColor: colors.divider,
  radius: radius.sm,
  contentBackground: colors.neutral,
  previewBackground: colors.surfaceMuted
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
