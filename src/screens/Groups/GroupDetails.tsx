import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native';
import {
  Button,
  Card,
  Chip,
  IconButton,
  Text,
  Checkbox,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { Theme } from '../../theme/Theme';
import Label from '../../components/label/label';
import ClaimCard from '../Claim/ClaimCard';
import {
  deleteClaim,
  getClaimById,
} from '../../features/Redux/thunks/ClaimThunk';
import { SubmitButton } from '../../components/button/Button';
import {
  cancelSubmit,
  deleteGroup,
  getClaimsByGroupId,
  getClaimsSubmittedByGroupId,
  getGroup,
  getGroupSubmitted,
  getGroupSubmittedById,
  getGroups,
  multipleExpensePayment,
  submitGroup,
  updateGroupAndClaim,
} from '../../features/Redux/thunks/GroupThunks';
import ScreenLoader from '../../components/loader/screenLoader';
import DialogCard from '../../components/dialogCard/dialogCard';
import { RefreshControl } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Modules from '../../utilities/Modules';
import { useAppTheme } from '../../../App';
import ClaimStatus from '../../utilities/ClaimStatus';
import GroupStatus from '../../utilities/GroupStatus';
import { getClaimGroupStatus } from '../../features/Redux/thunks/ClaimGroupStatusThunk';
import Input from '../../components/Input';
import { getDashboardDetails } from '../../features/Redux/thunks/DashboardThunks';
import { getClaimStatus } from '../../features/Redux/thunks/ClaimStatusThunk';
import { getCategories } from '../../features/Redux/thunks/CategoryThunks';
import { getAdvanceByReportId } from '../../features/Redux/thunks/advanceThunk';

const GroupDetails = ({ route }: any): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  let { group, claims }: any = useAppSelector(state => state.group);
  let checkForSubmittedClaim = claims.filter((claim: any) => {
    return claims && claim.claimStatusNormalizedName === ClaimStatus.submitted;
  });

  const claimStatusData = useAppSelector(
    state => state.claimStatus.allClaimStatus,
  );
  console.log(claimStatusData)
  let everyExpenseStstuaSame = (data: any) => data.every(
    (exp: any) => exp.claimStatusNormalizedName === claims[0].claimStatusNormalizedName)

  const [reportNormalizedName, setReportNormalizedName] = useState(everyExpenseStstuaSame(claims) ? claims.length > 0 && claims[0].claimStatusNormalizedName : '')

  let nextClaimStatus = (data: any) => data
    .filter((item: any) => {
      if (reportNormalizedName === ClaimStatus.pending) {
        return item.normalizedName === ClaimStatus.submitted;
      }
      if (reportNormalizedName === ClaimStatus.submitted) {
        return (
          item.normalizedName === ClaimStatus.accepted ||
          item.normalizedName === ClaimStatus.hold ||
          item.normalizedName === ClaimStatus.rejected
        );
      }
      if (reportNormalizedName === ClaimStatus.hold) {
        return (
          item.normalizedName === ClaimStatus.accepted ||
          item.normalizedName === ClaimStatus.rejected
        );
      }
    })
    .map((item: any) => {

      return {
        id: item.claimStatusId,
        claimStatusName: item.name,
        claimStatusNormalizedName: item.normalizedName,
      };
    });

  const [allClaimStatus, setAllcalaimStatus] = useState(nextClaimStatus(claimStatusData))
  const [isPartialypaid, setIsPartiallypaid] = useState(false)

  let claimStatusList: any = [];
  claims.forEach((claim: any) => {
    if (claimStatusList.indexOf(claim.claimStatusNormalizedName) === -1) {
      claimStatusList.push(claim.claimStatusNormalizedName)
    }
  })
  const claimGrpStatus = useAppSelector(
    state => state.claimGroupStatus.claimGroupStatus,
  );

  const [isStatusDialogVisible, setStatusIsDialogVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [selectedClaimGroup, setSelectedClaimGroup] = useState<any>('');
  const { isLoading } = useAppSelector(state => state.claimReducer);
  const {
    colors: { onSurfaceVariant, background },
  } = useAppTheme();
  const {
    expenseReportId,
    name,
    claimGroupStatusName,
    startDate,
    endDate,
    requestedAmount,
    approvedAmount,
    description,
    claimGroupStatusNormalizedName,
    userFirstName,
    userLastName,
    payableAmount,
    paidAmount,
  } = group;
  const { id, isFromPaymentDetails } = route.params;

  const [checked, setChecked] = useState(
    claims.map(() => {
      return false;
    }),
  );

  const permissions = useAppSelector(state => state.profile.permissions);
  const profileDetails: any = useAppSelector(state => state.profile.profile);
  const groupPermission: any = permissions.find(
    (each: any) => each.module === Modules.group,
  );

  const PermissionsForGroupFetch = {
    datas: [GroupStatus.approved, GroupStatus.submitted, GroupStatus.closed, GroupStatus.hold, GroupStatus.partially_paid, GroupStatus.reimbursed, GroupStatus.rejected],
  };

  const getClaim = () => {
    dispatch(getClaimsByGroupId(expenseReportId)).then((data: any) => {
      if (data && data.payload.data.length > 0) {
        let isSame = data.payload.data.every(
          (exp: any) => exp.claimStatusNormalizedName === data.payload.data[0].claimStatusNormalizedName)
        setReportNormalizedName(isSame ? data.payload.data[0].claimStatusNormalizedName : claimGroupStatusNormalizedName);
      }
    })
  }
  useFocusEffect(
    useCallback(() => {
      getClaim()
      dispatch(getClaimStatus())
    }, [])
  )

  useEffect(() => {
    setReportNormalizedName(everyExpenseStstuaSame(claims) ? claims.length > 0 && claims[0].claimStatusNormalizedName : '')
    setAllcalaimStatus(nextClaimStatus(claimStatusData))
  }, [group.claimGroupStatusName])

  useEffect(() => {
    setAllcalaimStatus(nextClaimStatus(claimStatusData))
  }, [reportNormalizedName])


  useFocusEffect(
    useCallback(() => {
      setReportNormalizedName(everyExpenseStstuaSame(claims) ? claims.length > 0 && claims[0].claimStatusNormalizedName : '')
      let newChkd = new Array(checked.length).fill(false)
      setChecked(newChkd)
      setAllcalaimStatus(nextClaimStatus(claimStatusData))
      dispatch(getGroup(expenseReportId))
      setSelectedExpense([])
    }, [])
  )

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSubmitDialogVisible, setIsSubmitDialogVisible] = useState(false);

  const [payingAmount, setPayingAmount] = useState<any>(approvedAmount);
  const [selectedExpDetail, setSelectedExpDetail] = useState<any>({});
  console.log(reportNormalizedName)
  console.log(allClaimStatus)

  const [refreshing, setRefreshing] = useState(false);
  const RBSheetRef: any = useRef(null);
  const [selectedExpense, setSelectedExpense] = useState<any>([]);

  const onRefresh = async () => {
    setRefreshing(true);

    groupPermission.changeGroupStatusPermission
      ? await dispatch(getGroupSubmittedById(expenseReportId))
      : await dispatch(getGroup(expenseReportId));
    dispatch(getClaimsByGroupId(expenseReportId));
    setRefreshing(false);
  };
  const onEdit = async () => {
    groupPermission.changeGroupStatusPermission
      ? await dispatch(getGroupSubmittedById(expenseReportId))
      : await dispatch(getGroup(expenseReportId));
    navigation.navigate('addGroup', { id: expenseReportId });
  };
  const onChangeStatus = async () => {

    let updateData = {
      id: id,
      groupUpdateData: {
        currentClaimStatusNormalizedName: claims[0].claimStatusNormalizedName,
        newClaimStatusNormalizedName: selectedClaimGroup.claimGroupStatusName,
      },
    };
    await dispatch(updateGroupAndClaim(updateData));
    await dispatch(getGroup(expenseReportId));
    await dispatch(getClaimsByGroupId(id));
    setAllcalaimStatus(nextClaimStatus(claimStatusData))
    setReportNormalizedName(selectedClaimGroup.claimGroupStatusName)
    setSelectedClaimGroup('');
  };

  const onDelete = () => {
    setIsDialogVisible(true);
  };

  const onConfirm = () => {
    dispatch(deleteGroup(expenseReportId));
  };

  const onConfirmSubmit = async () => {
    await dispatch(submitGroup(expenseReportId));
    groupPermission.changeGroupStatusPermission
      ? await dispatch(getGroupSubmitted(PermissionsForGroupFetch))
      : await dispatch(getGroups());
    await dispatch(getClaimGroupStatus());
    navigation.navigate('reports');
  };

  const onSumbitGroup = () => {
    setIsSubmitDialogVisible(true);
  };

  const confirmReportCancel = (statusName: string) => {
    setStatusIsDialogVisible(!isStatusDialogVisible);
    setStatusMessage(statusName);
  }

  const returnSubmittedReport = async () => {
    await dispatch(cancelSubmit(expenseReportId))
    onRefresh()
  }

  const onClaimEdit = async (id: number) => {
    await dispatch(getClaimById(id));
    navigation.navigate('addClaim', { id });
  };

  const onClaimDelete = async (id: number) => {
    await dispatch(deleteClaim(id));
  };

  const chechboxInside = (data: any, index: number) => {
    let newCheckd = [...checked];
    newCheckd[index] = !newCheckd[index];
    setChecked(newCheckd);

    let newExp: any = [...selectedExpense];
    const indexOfExpenseId = newExp.findIndex((exp: any) => exp.expenseId === data.expenseId);

    if (indexOfExpenseId === -1) {
      newExp.push(data);
    } else {
      newExp.splice(indexOfExpenseId, 1);
    }
    setSelectedExpense(newExp);
    setAllcalaimStatus(nextClaimStatus(claimStatusData))
    if (data.claimStatusNormalizedName == GroupStatus.partially_paid) setIsPartiallypaid(true)
    else setIsPartiallypaid(false)
  }


  const handleCheckBox = async (data: any, index: number) => {
    if (reportNormalizedName == '') {
      setReportNormalizedName(data.claimStatusNormalizedName)
      chechboxInside(data, index)
    }
    if (data.claimStatusNormalizedName === reportNormalizedName) {
      chechboxInside(data, index)
    }
  };
  const handlePayAmount = async () => {
    let balanceAmount = payingAmount;
    let newSelectedExpense: any = []
    selectedExpense.forEach((exp: any) => {
      if (balanceAmount >= exp.approvedAmount) {
        newSelectedExpense.push({ ...exp, paidAmount: exp.approvedAmount, claimStatusId: 7 })
        balanceAmount -= exp.approvedAmount
      }
      else {
        if (balanceAmount > 0) {
          newSelectedExpense.push({ ...exp, paidAmount: balanceAmount, claimStatusId: 6 })
          balanceAmount -= exp.approvedAmount
        }
      }
    })
    let updateData = {
      "expenseList": newSelectedExpense
    }
    console.info(updateData)
    await dispatch(multipleExpensePayment(updateData))
    await dispatch(getGroupSubmittedById(expenseReportId))
    await dispatch(getClaimsByGroupId(expenseReportId));
    let newChkd = new Array(checked.length).fill(false)
    setChecked(newChkd)
    RBSheetRef.current.close();
  };

  const checkedStstusChange = async () => {
    let newExpenseData = selectedExpense.map((exp: any) => {
      if (selectedExpDetail.id === 4) {
        return {
          expenseId: exp.expenseId,
          claimStatusId: selectedExpDetail.id,
          approvedAmount: exp.expenseAmount,
          paidAmount: exp.paidAmount == null ? null : exp.paidAmount
        }
      }
      else {
        return {
          expenseId: exp.expenseId,
          claimStatusId: selectedExpDetail.id,
          approvedAmount: exp.approvedAmount == null ? null : exp.approvedAmount,
          paidAmount: exp.paidAmount == null ? null : exp.paidAmount
        }
      }
    })
    let updateData = {
      "expenseList": newExpenseData
    }
    console.log(updateData)
    await dispatch(multipleExpensePayment(updateData))
    await dispatch(getGroup(expenseReportId));
    await dispatch(getClaimsByGroupId(id));
    setAllcalaimStatus(nextClaimStatus(claimStatusData))
    setReportNormalizedName(selectedClaimGroup.claimGroupStatusName)
    setSelectedClaimGroup('');
    let newChkd = new Array(checked.length).fill(false)
    setChecked(newChkd)
    setSelectedExpense([])
  }

  const handlePayNow = async () => {
    await dispatch(getCategories());
    await dispatch(getAdvanceByReportId(expenseReportId))
    navigation.navigate('paymentDetails', {
      allExp: claims,
      expenseReportId: expenseReportId,
      toggleIsfromPaymennt: isFromPaymentDetails ? false : true,
      groupId: id
    })
  }

  const handleGroupStatusChange = (data: any) => {
    setStatusIsDialogVisible(!isStatusDialogVisible);
    setStatusMessage(data.claimGroupStatusName);
    setSelectedClaimGroup(data);
    setSelectedExpDetail(data)
  };
  const handlePayingAmount = (amt: number) => {
    setPayingAmount(amt);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Card style={styles.cardContainer} elevation={1}>
          <Card.Title title="Report Details" titleStyle={styles.cardTitle} />
          <Card.Content>
            {profileDetails.roleName === 'ADMIN' && (
              <View style={styles.row}>
                <Label
                  title="Username"
                  value={`${userFirstName} ${userLastName || ''}`}
                />
              </View>
            )}
            <View style={styles.row}>
              <Label title="Name" value={name} />
              <Label title="Status" value={claimGroupStatusName} />
            </View>
            <View style={styles.row}>
              <Label
                title="Start Date"
                value={new Date(startDate).toDateString()}
              />
              <Label
                title="End Date"
                value={new Date(endDate).toDateString()}
              />
            </View>
            <View style={styles.row}>
              <Label
                title="Requested Amount"
                value={requestedAmount ? `₹ ${requestedAmount}` : 'N/A'}
              />
              <Label
                title="Approved Amount"
                value={approvedAmount ? `₹ ${approvedAmount}` : 'N/A'}
              />
            </View>
            <View style={styles.row}>
              <Label title="Payable Amount" value={`₹ ${payableAmount}.00`} />
              <Label title="Paid Amount" value={`₹ ${paidAmount}.00`} />
            </View>
            <View style={styles.row}>
              <Label title="Description" value={description} />

              {groupPermission.changeGroupStatusPermission &&
                checkForSubmittedClaim.length > 0 && (
                  <View style={styles.buttonContainer}>
                    <IconButton
                      iconColor={onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onEdit()}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => onDelete()}
                    />
                  </View>
                )}
              {groupPermission.editPermission &&
                claimGroupStatusNormalizedName === GroupStatus.new && (
                  <View style={styles.buttonContainer}>
                    <IconButton
                      iconColor={onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onEdit()}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => onDelete()}
                    />
                  </View>
                )}

            </View>
            {
              groupPermission.changeGroupStatusPermission &&
              selectedExpense.length == 0 &&
              everyExpenseStstuaSame(claims) && (
                <View style={styles.statusButtons}>
                  {allClaimStatus.map((status: any) => {
                    return (
                      <Button
                        key={status.id}
                        style={{ flex: 1, marginHorizontal: '1%' }}
                        mode="contained"
                        onPress={() => handleGroupStatusChange({
                          claimGroupStatusName: status.claimStatusNormalizedName,
                          id: status.id,
                        })}>
                        <Text style={{ fontSize: 10, color: background, width: '100%' }}>
                          {(status.claimStatusName === 'Approved' && 'Approve') ||
                            (status.claimStatusName === 'Rejected' && 'Reject') ||
                            status.claimStatusName}
                        </Text>
                      </Button>
                    )
                  })}

                  {groupPermission.changeGroupStatusPermission &&
                    reportNormalizedName === GroupStatus.submitted && (
                      <Button
                        style={{ flex: 1 }}
                        onPress={() =>
                          confirmReportCancel('Un Submitted')
                        }
                        mode="contained">
                        <Text style={{ fontSize: 10, color: background, width: '100%' }}>
                          Return
                        </Text>
                      </Button>
                    )}
                </View>
              )}

          </Card.Content>

          {!groupPermission.changeGroupStatusPermission &&
            claimGroupStatusNormalizedName === GroupStatus.new &&
            claims.length > 0 && (
              <View style={styles.buttonContainer}>
                <SubmitButton
                  title={'Submit'}
                  onPress={() => onSumbitGroup()}
                />
              </View>
            )}
          {!groupPermission.changeGroupStatusPermission &&
            claimGroupStatusNormalizedName === GroupStatus.submitted && (
              <View style={styles.buttonContainer}>
                <SubmitButton
                  title={'Recall'}
                  onPress={() => confirmReportCancel('Un Submitted')}
                />
              </View>
            )}
          {groupPermission.changeGroupStatusPermission &&
            (reportNormalizedName === GroupStatus.partially_paid || claimGroupStatusNormalizedName === GroupStatus.partially_paid) &&
            <View style={styles.statusButtonsTwo}>
              <Button onPress={() => handlePayNow()} mode="contained">
                <Text style={{ fontSize: 10, color: background, width: '100%' }}>
                  Pay now
                </Text>
              </Button>
            </View>
          }
          {groupPermission.changeGroupStatusPermission &&
            (reportNormalizedName === GroupStatus.approved || claimGroupStatusNormalizedName === GroupStatus.approved) &&
            <View style={styles.statusButtonsTwo}>
              <Button onPress={() => handlePayNow()} mode="contained">
                <Text style={{ fontSize: 10, color: background, width: '100%' }}>
                  Pay now
                </Text>
              </Button>
            </View>
          }
        </Card>
        <Card style={styles.cardContainer} elevation={1}>
          <Card.Title title={`Expenses`} titleStyle={styles.cardTitle} />
          <Card.Content>
            {claims.length > 0 ? (
              claims.map((item: any, index: number) => {
                let notClosedRejected = item.claimStatusNormalizedName === ClaimStatus.submitted &&
                  item.claimStatusNormalizedName == ClaimStatus.hold
                let newDescription = item.description;
                if (newDescription.length > 30) {
                  newDescription = newDescription.slice(0, 26) + '....';
                }
                return (
                  <View key={item.expenseId} style={[styles.claimContainer, { width: notClosedRejected ? '104%' : '100%' }]}>
                    <ClaimCard
                      id={item.expenseId}
                      onEdit={onClaimEdit}
                      onDelete={onClaimDelete}
                      key={item.expenseId}
                      date={item.expenseDate}
                      claimStatusId={item.claimStatusId}
                      claimStatusName={item.claimStatusName}
                      expenseAmount={item.expenseAmount}
                      approvedAmount={item.approvedAmount}
                      paidAmount={item.paidAmount}
                      description={newDescription}
                      isGroupDetails={true}
                      claimStatusColor={item.claimStatusColor}
                      claimStatusNormalizedName={item.claimStatusName.toUpperCase()}
                      expenseReportName={item.expenseReportName}
                      expenseReportId={item.expenseReportId}
                      claimGroupStatusId={group.claimGroupStatusId}
                    />
                    {groupPermission.changeGroupStatusPermission &&
                      (item.claimStatusNormalizedName === ClaimStatus.submitted ||
                        item.claimStatusNormalizedName === ClaimStatus.hold) && (
                        <View style={{ justifyContent: 'center' }}>
                          <Checkbox
                            status={checked[index] ? 'checked' : 'unchecked'}
                            onPress={() => handleCheckBox(item, index)}
                          />
                        </View>
                      )}
                  </View>
                );
              })
            ) : (
              <View>
                <Text>There are no claims under this group!</Text>
              </View>
            )}
          </Card.Content>
        </Card>


        {groupPermission.changeGroupStatusPermission && selectedExpense.length > 0 && <Card style={styles.cardContainer} elevation={1}>
          <Card.Content>
            <View
              style={styles.bttomButtons}>
              {groupPermission.changeGroupStatusPermission && selectedExpense.length > 0 &&
                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-around' }}>
                  {allClaimStatus.map((status: any) => {
                    return (
                      <Button
                        key={status.id}
                        style={{ flex: 1, marginHorizontal: '1%' }}
                        mode="contained"
                        onPress={() => handleGroupStatusChange({
                          claimGroupStatusName: status.claimStatusNormalizedName,
                          id: status.id,
                        })}>
                        <Text style={{ fontSize: 10, color: background, width: '100%' }}>
                          {(status.claimStatusName === 'Accepted' && 'Accept') ||
                            (status.claimStatusName === 'Rejected' && 'Reject') ||
                            status.claimStatusName}
                        </Text>
                      </Button>
                    )
                  })}
                </View>
              }
            </View>
          </Card.Content>
        </Card>}
      </ScrollView>

      <RBSheet
        ref={RBSheetRef}
        height={wp(50)}
        openDuration={600}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            padding: '8 %',
          }}>
          <View style={styles.bsheetInput}>
            <Input
              handleChange={handlePayingAmount}
              title="Amount"
              placeholder="Enter Amount"
              keyboard="numeric"
              value={payingAmount}
            />
            <SubmitButton
              title={'Complete Payment'}
              onPress={handlePayAmount}
            />
          </View>
        </ScrollView>
      </RBSheet>
      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onConfirm()}
      />
      <DialogCard
        message="Are you sure you want to submit?"
        isDialogVisible={isSubmitDialogVisible}
        setIsDialogVisible={setIsSubmitDialogVisible}
        onConfirm={() => onConfirmSubmit()}
      />
      <DialogCard
        message={`Are you sures want to change group status to ${statusMessage} ?`}
        isDialogVisible={isStatusDialogVisible}
        setIsDialogVisible={setStatusIsDialogVisible}
        onConfirm={() => statusMessage === 'Un Submitted' ? returnSubmittedReport() : selectedExpense.length == 0 ? onChangeStatus() : checkedStstusChange()}
      />
      {isLoading && <ScreenLoader visible={isLoading} />}
    </>
  );
};
export default GroupDetails;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
  },
  cardTitle: {
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.8,
    paddingVertical: 15,
  },
  statusButtonsTwo: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.8,
    paddingVertical: 15,
    marginLeft: '10%'
  },
  AcceptDelete: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  bsheetInput: {
    width: '90%',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%',
    width: '130%',
    marginLeft: '-10%',
  },
  dropDown: {
    width: '70%',
  },
  claimContainer: {
    flexDirection: 'row',
    width: '105%',
  },
  bttomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%',
    width: '120%',
    marginLeft: '-10%',
  }
});
