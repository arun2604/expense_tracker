import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Theme } from '../../theme/Theme';
import { DeleteButton, EditButton } from '../../components/button/Button';
import {
  deleteUser,
  getUser,
  updateUser,
  initialData,
  getAllUsers,
} from '../../features/Redux/thunks/UserThunks';
import Label from '../../components/label/label';
import DialogCard from '../../components/dialogCard/dialogCard';
import { Pressable } from 'react-native';
import { useAppTheme } from '../../../App';
import Permissions from '../../utilities/Permissions';
import { RefreshControl } from 'react-native';
import Modules from '../../utilities/Modules';
import PaymentHistory from './PaymentHistory';

const UserDetails = ({ route }: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userState: any = useAppSelector(state => state.user);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState('status');
  // const [showSnackbar, setShowSnackbar] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUser(id));
    setRefreshing(false);
  };

  const permissions = useAppSelector(state => state.profile.permissions);

  const userPermission: any = permissions.find(
    (each: any) => each.module === Modules.user,
  );
  const {
    colors: { background, onSurfaceVariant, outline },
  } = useAppTheme();

  const id = route.params;

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser(id));
    }, [id]),
  );

  const {
    firstName,
    lastName,
    gender,
    email,
    mobileNumber,
    companyName,
    departmentName,
    roleName,
    isActive,
    accountNumber,
    advanceAmount,
    claimAmount,
    paymentTransactions,
  } = userState.user;
  let totalSubmittedAmount = 0;
  let totalApprovedAmount = 0;
  let totalPayableAmount = 0;
  let totalPaidAmount = 0;
  userState.user.allRports &&
    userState.user.allRports.forEach((report: any) => {
      totalSubmittedAmount += Number(report.requestedAmount);
      totalPaidAmount += Number(report.paidAmount);
      totalPayableAmount += Number(report.payableAmount);
      totalApprovedAmount += Number(report.approvedAmount);
    });
  const status = isActive ? true : false;

  const onPressEdit = async () => {
    await dispatch(initialData(id));
    navigation.navigate('addUser', id);
  };

  const onPressDelete = async () => {
    setDialogType('delete');
    setIsDialogVisible(true);
  };

  const onConfirmDelete = async () => {
    await dispatch(deleteUser(id));
    setIsDialogVisible(false);
    navigation.navigate('users', id);
  };

  const onPressSwitch = async () => {
    setDialogType('status');
    setIsDialogVisible(true);
  };

  const onConfirmStatusChange = async () => {
    const update = {
      updateData: { isActive: !isActive },
      id,
    };
    await dispatch(updateUser(update));
    await dispatch(getAllUsers(''));
    // setShowSnackbar(true);
    // setTimeout(() => {
    //   setShowSnackbar(false);
    // }, 3000);
    ToastAndroid.show(
      `Status successfully changed to ${isActive ? 'Inactive' : 'Active'}`,
      ToastAndroid.SHORT,
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={[
            styles.card,
            { backgroundColor: background, borderColor: outline },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurfaceVariant }]}>
              Personal details
            </Text>
            <View style={styles.box}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 13,
                    color: `${userPermission.editPermission
                        ? onSurfaceVariant
                        : status
                          ? '#2cf243'
                          : '#ff0000'
                      }`,
                  },
                ]}>
                {status ? 'Active' : 'InActive'}
              </Text>
              {userPermission.editPermission && (
                <Pressable onPress={onPressSwitch}>
                  <Switch
                    trackColor={{ false: '#ff0000', true: '#2cf243' }}
                    thumbColor={status ? '#ffffff' : '#ffffff'}
                    value={status}
                    style={{ transform: [{ scale: 0.8 }] }}
                    disabled
                  />
                </Pressable>
              )}
            </View>
          </View>
          <Label title="First Name" value={firstName} />
          <Label title="Last Name" value={lastName || 'NA'} />
          <Label title="Gender" value={gender || 'NA'} />
          <Label title="Mobile Number" value={mobileNumber || 'NA'} />
          <Label
            title="Email"
            value={email}
            extraStyle={{
              labelStyle: { width: '100%' },
              valueStyle: { textTransform: 'lowercase' },
            }}
          />
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: background, borderColor: outline },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurfaceVariant }]}>
              Work details
            </Text>
          </View>
          <Label title="Department" value={departmentName} />
          <Label title="Role" value={roleName} />
          <Label title="Company" value={companyName} />
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: background, borderColor: outline },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurfaceVariant }]}>
              Payment details
            </Text>
          </View>
          <Label
            title="Submitted Amount"
            value={String(totalSubmittedAmount)}
          />
          <Label title="Approved Amount" value={String(totalApprovedAmount)} />
          <Label title="Payable Amount" value={String(totalPayableAmount)} />
          <Label title="Paid Amount" value={String(totalPaidAmount)} />
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: background, borderColor: outline },
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: onSurfaceVariant }]}>
              Account details
            </Text>
            {/* <Text style={styles.text}>{accountNumber}</Text> */}
          </View>
          <Label
            title="Account Number"
            value={accountNumber}
            extraStyle={{
              labelStyle: { width: '100%' },
            }}
          />
          <Label title="Claim Amount" value={claimAmount} />
          <Label title="Advance Amount" value={advanceAmount} />
        </View>
        {paymentTransactions && (
          <PaymentHistory paymentTransactions={paymentTransactions} />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {userPermission.editPermission && (
          <EditButton onPress={() => onPressEdit()} />
        )}
        {userPermission.deletePermission && (
          <DeleteButton onPress={() => onPressDelete()} />
        )}
      </View>
      {dialogType === 'status' && (
        <DialogCard
          message={`Are you sure you want to change the status to ${isActive ? 'Inactive' : 'Active'
            }`}
          isDialogVisible={isDialogVisible}
          setIsDialogVisible={setIsDialogVisible}
          onConfirm={onConfirmStatusChange}
        />
      )}
      {dialogType === 'delete' && (
        <DialogCard
          message="Are you sure you want to delete?"
          isDialogVisible={isDialogVisible}
          setIsDialogVisible={setIsDialogVisible}
          onConfirm={onConfirmDelete}
        />
      )}
      {/* <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        elevation={1}
        action={{
          label: 'Close',
          onPress: () => {
            setShowSnackbar(true);
          },
        }}>
        <Text style={styles.title}>Status change successfully</Text>
      </Snackbar> */}
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: Theme.SECONDARY,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  dialog: {
    backgroundColor: Theme.PRIMARY,
  },
  btn: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'blue',
  },
});
