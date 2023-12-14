import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useAppTheme} from '../../../App';

interface props {
  title: string;
  count: number;
}

const CountCard = (props: props): JSX.Element => {
  const {title, count} = props;
  const {colors} = useAppTheme();
  return (
    <View
      style={[
        styles.cardContainer,
        {backgroundColor: colors.dashBoardPrimary},
      ]}>
      <Text variant="titleSmall">{title}</Text>
      <Text variant="displayMedium">{count}</Text>
    </View>
  );
};

export default CountCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 15,
    borderRadius: 10,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
