import { StyleSheet, Text, View } from 'react-native';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export function SelectionCheckmark({ selected, order }: { selected?: boolean; order?: number }) {
  return (
    <View style={[styles.indicator, selected ? styles.selected : null]}>
      {selected && order ? <Text style={styles.orderText}>{order}</Text> : null}
      {selected && !order ? <SparksIcon name="check" color={colors.white} size={13} /> : null}
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
    backgroundColor: colors.disabledSurface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    backgroundColor: colors.main,
    borderColor: colors.main
  },
  orderText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11,
    lineHeight: 14
  }
});
