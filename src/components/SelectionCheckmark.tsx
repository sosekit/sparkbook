import { StyleSheet, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';

export function SelectionCheckmark({ selected }: { selected?: boolean }) {
  return (
    <View style={[styles.indicator, selected ? styles.selected : null]}>
      {selected ? <SparkbookIcon name="check" color={colors.white} size={13} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    backgroundColor: colors.main,
    borderColor: colors.main
  }
});
