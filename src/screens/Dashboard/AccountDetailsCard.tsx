import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useAppTheme} from '../../../App';
import {Text} from 'react-native-paper';
import UserRoles from '../../utilities/UserRoles';

interface props {
  accountDetails: {
    advanceAmount: number;
    claimAmount: number;
  };
  roleName: string;
}

const AccountDetailsCard = (props: props) => {
  const {accountDetails, roleName} = props;
  const {advanceAmount, claimAmount} = accountDetails;
  const {colors} = useAppTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.dashBoardPrimary}]}>
      <Text variant="titleLarge" style={styles.title}>
        Account details
      </Text>
      <View style={styles.row}>
        <Text style={styles.text}>
          {roleName === UserRoles.admin
            ? 'Total Paid Amount : '
            : 'Claim Amount : '}
        </Text>
        <Text style={styles.text}>{claimAmount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>
          {roleName === UserRoles.admin
            ? 'Total Advance Amount : '
            : 'Advance Amount : '}
        </Text>
        <Text style={styles.text}>{advanceAmount}</Text>
      </View>
    </View>
  );
};

export default AccountDetailsCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  title: {
    fontWeight: '500',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 5,
  },
});
