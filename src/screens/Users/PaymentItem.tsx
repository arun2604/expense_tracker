import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAppTheme} from '../../../App';

interface PaymentItemProps {
  payment: {
    id: string;
    amount: number;
    date: string;
    type: string;
    payer: string;
  };
}

const PaymentItem: React.FC<PaymentItemProps> = ({payment}) => {
  const {colors} = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    amount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.highlight,
    },
    date: {
      fontSize: 14,
      color: colors.onSurfaceVariant,
    },
    type: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'capitalize',
      textAlign: 'right',
      color: colors.onSurfaceVariant,
    },
    paidBy: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      textAlign: 'right',
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.amount}>&#x20B9; {payment.amount}</Text>
        <Text style={styles.date}>{new Date(payment.date).toDateString()}</Text>
      </View>
      <View>
        <Text style={styles.type}>{payment.type.split(' ')[0]}</Text>
        <Text style={styles.paidBy}>Paid by: {payment.payer}</Text>
      </View>
    </View>
  );
};

export default PaymentItem;
