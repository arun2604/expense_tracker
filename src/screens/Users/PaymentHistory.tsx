import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import PaymentItem from './PaymentItem';
import {useAppTheme} from '../../../App';
import {Text, IconButton, Divider} from 'react-native-paper';

interface Payment {
  id: number;
  date: string;
  amount: number;
  type: string;
  payer: string;
}

const PaymentHistory = ({paymentTransactions}: any) => {
  const paymentData: Payment[] = [];
  const {colors} = useAppTheme();
  const [showTransaction, setShowTransaction] = useState(false);
  const [showAllTransaction, setShowAllTransaction] = useState(false);

  paymentTransactions.forEach((item: any) => {
    const value = {
      id: item.transactionId,
      date: item.transactionOn,
      amount: item.amount,
      type: item.eventType,
      payer: item.payer,
    };
    paymentData.push(value);
  });

  const defaultTransactionLength: number = 5;

  const transactions = paymentData.filter((item: Payment, index: number) =>
    showAllTransaction ? true : index >= 0 && index < defaultTransactionLength,
  );

  const onClickShowIcon = () => {
    setShowTransaction(preState => !preState);
    setShowAllTransaction(false);
  };

  const onClickSeeAll = () => {
    setShowAllTransaction(preState => !preState);
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      backgroundColor: colors.background,
      borderColor: colors.outline,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      textTransform: 'capitalize',
      color: colors.onSurfaceVariant,
    },
    arrowBtn: {
      margin: 0,
      padding: 0,
    },
    seeAllBtn: {
      alignSelf: 'flex-end',
      marginTop: 10,
      color: colors.highlight,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
        <IconButton
          icon={showTransaction ? 'chevron-up' : 'chevron-down'}
          size={20}
          onPress={onClickShowIcon}
          style={styles.arrowBtn}
        />
      </View>
      {showTransaction && paymentData.length === 0 && (
        <Text variant="labelLarge">Payments not available</Text>
      )}
      {showTransaction && paymentData.length > 0 && (
        <>
          {transactions.map((item: any, index: number) => (
            <View key={item.id}>
              <PaymentItem payment={item} />
              {index !== transactions.length - 1 && <Divider bold />}
            </View>
          ))}
          {defaultTransactionLength < paymentData.length && (
            <>
              <Divider bold />
              <Pressable onPress={onClickSeeAll}>
                <Text variant="labelLarge" style={styles.seeAllBtn}>
                  {showAllTransaction ? 'See less' : 'See more'}
                </Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default PaymentHistory;

// import React from 'react';
// import {StyleSheet, View} from 'react-native';
// import {Text} from 'react-native-paper';
// import {useAppTheme} from '../../../App';

// const PaymentHistory = (props: any): JSX.Element => {
//   const {paymentTransactions} = props;
//   const {colors} = useAppTheme();
//   //   const temp = [
//   //     {
//   //       date: '25-07-23',
//   //       amount: '10000.00',
//   //       type: 'Claim',
//   //       paidBy: 'SystemAdmin',
//   //     },
//   //     {
//   //       date: '25-07-23',
//   //       amount: '10000.00',
//   //       type: 'Claim',
//   //       paidBy: 'SystemAdmin',
//   //     },
//   //   ];

//   const formattedDate = (dateString: string) => {
//     const dateObject = new Date(dateString);
//     const day = dateObject.getUTCDate();
//     const month = dateObject.getUTCMonth() + 1;
//     const year = dateObject.getUTCFullYear() % 100;
//     return `${day}-${month}-${year}`;
//   };

//   const styles = StyleSheet.create({
//     container: {
//       borderColor: 'white',
//       borderRadius: 10,
//       padding: 15,
//       marginBottom: 15,
//       borderWidth: 1,
//     },
//     header: {
//       width: '100%',
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     },
//     title: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 5,
//       textTransform: 'capitalize',
//       color: colors.onSurfaceVariant,
//     },
//     row: {
//       flexDirection: 'row',
//       width: '100%',
//       marginBottom: 5,
//     },
//     headerRow: {
//       marginBottom: 10,
//     },
//     serialNumber: {
//       width: '12%',
//       textAlign: 'center',
//     },
//     headerText: {
//       paddingHorizontal: 1,
//     },
//     date: {
//       width: '20%',
//     },
//     amount: {
//       width: '25%',
//     },
//     type: {
//       width: '15%',
//       textTransform: 'capitalize',
//     },
//     paidBy: {
//       width: '25%',
//     },
//     text: {
//       paddingHorizontal: 1,
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Payment History</Text>
//       </View>
//       <View style={[styles.row, styles.headerRow]}>
//         <Text
//           variant="labelLarge"
//           style={[styles.serialNumber, styles.headerText]}>
//           S.No.
//         </Text>
//         <Text variant="labelLarge" style={[styles.date, styles.headerText]}>
//           Date
//         </Text>
//         <Text variant="labelLarge" style={[styles.amount, styles.headerText]}>
//           Amount
//         </Text>
//         <Text variant="labelLarge" style={[styles.type, styles.headerText]}>
//           Type
//         </Text>
//         <Text variant="labelLarge" style={[styles.paidBy, styles.headerText]}>
//           Paid By
//         </Text>
//       </View>
//       {paymentTransactions.map((item: any, index: number) => (
//         <View key={index} style={styles.row}>
//           <Text variant="labelSmall" style={[styles.serialNumber, styles.text]}>
//             {index + 1}
//           </Text>
//           <Text variant="labelSmall" style={[styles.date, styles.text]}>
//             {formattedDate(item.transactionOn)}
//           </Text>
//           <Text variant="labelSmall" style={[styles.amount, styles.text]}>
//             {item.amount}
//           </Text>
//           <Text variant="labelSmall" style={[styles.type, styles.text]}>
//             {item.eventType.split(' ')[0]}
//           </Text>
//           <Text variant="labelSmall" style={[styles.paidBy, styles.text]}>
//             {item.payer}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// export default PaymentHistory;
