import type React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/spacing';
import { Logo } from './Logo';

type HeaderProps = {
  right?: React.ReactNode;
};

export function Header({ right }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Logo />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm
  }
});
