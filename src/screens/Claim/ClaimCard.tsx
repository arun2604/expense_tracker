/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */

import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../../theme/Theme';
import { Text, IconButton, Card, TouchableRipple } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  getClaimById,
  getClaimByIdAdmin,
  getClaimHistoryById,
  updateClaimAdmin,
} from '../../features/Redux/thunks/ClaimThunk';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DialogCard from '../../components/dialogCard/dialogCard';
import { useAppTheme } from '../../../App';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';
import ClaimStatus from '../../utilities/ClaimStatus';
import {
  getClaimsByGroupId,
  getGroupSubmittedById,
} from '../../features/Redux/thunks/GroupThunks';

interface claimProps {
  id: number;
  date: Date;
  claimStatusId: number;
  expenseAmount: number;
  approvedAmount: number;
  paidAmount: number;
  description: string;
  claimStatusName: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isGroupDetails?: boolean;
  claimStatusColor: string;
  expenseReportName?: string;
  claimStatusNormalizedName: string;
  username?: string;
  roleName?: string;
  expenseReportId?: number;
  claimGroupStatusId: number
}

const ClaimCard = (props: claimProps) => {
  const {
    date,
    claimStatusName,
    expenseAmount,
    approvedAmount,
    description,
    id,
    onEdit,
    onDelete,
    isGroupDetails,
    claimStatusColor,
    expenseReportName,
    claimStatusNormalizedName,
    username,
    expenseReportId,
    claimGroupStatusId
  } = props;

  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const permissions = useAppSelector(state => state.profile.permissions);
  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );

  const [isStatusDialogVisible, setStatusIsDialogVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<any>('');

  const onClickConfirm = (claimid: number) => {
    onDelete(claimid);
    setIsDialogVisible(false);
  };

  const changeStatusconfirm = async () => {
    const updateclaimDatareject = {
      id: id,
      claimObj: {
        claimStatusId: selectedClaim.id,
      },
    };
    const updateclaimDataAccept = {
      id: id,
      claimObj: {
        claimStatusId: selectedClaim.id,
        approvedAmount: expenseAmount,
      },
    };
    await dispatch(
      updateClaimAdmin(
        selectedClaim.claimStatusNormalizedName === ClaimStatus.accepted
          ? updateclaimDataAccept
          : updateclaimDatareject,
      ),
    );
    await dispatch(getClaimsByGroupId(expenseReportId));
    await dispatch(getGroupSubmittedById(expenseReportId));
  };

  const handleClaimChangeStatus = async (data: any) => {
    setStatusIsDialogVisible(!isStatusDialogVisible);
    setStatusMessage(data.claimStatusName);
    setSelectedClaim(data);
  };

  const handleViewClaim = async () => {
    if (claimPermission.viewPermission) {
      await dispatch(getClaimById(id));
      await dispatch(getClaimHistoryById(id));
      navigation.navigate('claimDetails', id);
    }
  };


  return (<ScrollView style={styles.wrapper}>
    <Card
      style={[
        isGroupDetails ? styles.groupDetailPageContainer : styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.outline,
          borderWidth: 1,
          marginRight: !claimPermission.changeClaimStatusPermission ? wp(3) : null
        },
      ]}
      elevation={0}>
      <TouchableRipple
        onPress={handleViewClaim}
        rippleColor={Theme.RIPPLE_PRIMARY}>
        <View>
          <Card.Title
            title={new Date(date).toDateString()}
            titleStyle={styles.title}
            right={() => {
              return (
                <View>
                  {claimStatusNormalizedName === ClaimStatus.hold &&
                    claimPermission.changeClaimStatusPermission && claimGroupStatusId < 4 &&
                    <Text
                      style={[
                        styles.title,
                        { padding: 3, paddingHorizontal: 6, backgroundColor: claimStatusColor, color: colors.background, marginRight: 20, borderRadius: 5 },
                      ]}>
                      {claimStatusName}
                    </Text>}
                  {claimStatusNormalizedName === ClaimStatus.accepted &&
                    claimPermission.changeClaimStatusPermission && claimGroupStatusId < 4 &&
                    <Text
                      style={[
                        styles.title,
                        { padding: 3, paddingHorizontal: 6, backgroundColor: claimStatusColor, color: colors.background, marginRight: 20, borderRadius: 5 },
                      ]}>
                      {claimStatusName}
                    </Text>}
                </View>
              );
            }}
          />
          <Card.Content>
            {claimPermission.changeClaimStatusPermission && username && (
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>Username : </Text>
                <Text style={styles.amount}>{username}</Text>
              </View>
            )}
            {expenseReportName && <View style={styles.amountContainer}>
              <Text style={styles.amountText}>Group name : </Text>
              <Text style={styles.amount}>{expenseReportName}</Text>
            </View>}
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>Requested Amount : </Text>
              <Text style={styles.amount}>
                {expenseAmount ? expenseAmount : 'N/A'}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>Approved Amount : </Text>
              <Text style={styles.amount}>
                {approvedAmount ? approvedAmount : 'N/A'}
              </Text>
            </View>
            <View style={[styles.descriptionContainer, { marginBottom: 10 }]}>
              <Text style={styles.descriptionText}>{description}</Text>
              {claimPermission.editPermission &&
                claimStatusNormalizedName === ClaimStatus.pending && (
                  <View style={styles.buttonContainer}>
                    <IconButton
                      iconColor={colors.onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onEdit(id)}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => setIsDialogVisible(true)}
                    />
                  </View>
                )}
            </View>
          </Card.Content>
        </View>
      </TouchableRipple>
    </Card>
    <DialogCard
      message="Are you sure you want to delete?"
      isDialogVisible={isDialogVisible}
      setIsDialogVisible={setIsDialogVisible}
      onConfirm={() => onClickConfirm(id)}
    />
    <DialogCard
      message={`sure you want to chnage claim status to ${statusMessage} ?`}
      isDialogVisible={isStatusDialogVisible}
      setIsDialogVisible={setStatusIsDialogVisible}
      onConfirm={() => changeStatusconfirm()}
    />
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    margin: 5,
  },
  groupDetailPageContainer: {
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontWeight: '700',
    alignItems: 'center',
  },
  date: {
    fontWeight: '500',
  },
  amountContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
  },
  amountText: {
    fontWeight: '600',
  },
  amount: {
    fontWeight: '400',
    marginLeft: 'auto',
    marginRight: '5%',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  descriptionText: {
    paddingVertical: '0.7%',
  },
  icon: {
    paddingRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  claimStatus: {
    fontWeight: '700',
    padding: 10,
    borderRadius: 10,
    left: -5,
    paddingVertical: 5,
  },
  claimDetails: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#7f807f',
    marginTop: wp(5),
  },
});
export default ClaimCard;
