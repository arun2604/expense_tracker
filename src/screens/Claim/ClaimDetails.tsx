import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Chip,
  Modal,
  Portal,
  Text,
  Button as PaperButton,
  Button,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Theme } from '../../theme/Theme';
import { Image } from 'react-native-elements';
import {
  CancelButton,
  DeleteButton,
  EditButton,
  SubmitButton,
} from '../../components/button/Button';
import { Dimensions } from 'react-native';
import {
  deleteClaim,
  getClaimById,
  getClaimByIdAdmin,
  getClaimHistoryById,
  getClaimInitialData,
  getClaims,
  updateClaim,
  updateClaimAdmin,
} from '../../features/Redux/thunks/ClaimThunk';
import Label from '../../components/label/label';
import DialogCard from '../../components/dialogCard/dialogCard';
import Permissions from '../../utilities/Permissions';
import Input from '../../components/Input';
import RBSheet from 'react-native-raw-bottom-sheet';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { getClaimStatus } from '../../features/Redux/thunks/ClaimStatusThunk';
import Modules from '../../utilities/Modules';
import { useAppTheme } from '../../../App';
import ClaimStatus from '../../utilities/ClaimStatus';
import {
  getClaimsByGroupId,
  getGroup,
  getGroupSubmittedById,
} from '../../features/Redux/thunks/GroupThunks';

const ClaimDetails = ({ route }: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const claimState = useAppSelector(state => state.claimReducer);
  const permissions = useAppSelector(state => state.profile.permissions);
  const profileDetails: any = useAppSelector(state => state.profile.profile);

  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );
  const groupPermission: any = permissions.find(
    (each: any) => each.module === Modules.group,
  );

  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isStatusDialogVisible, setStatusIsDialogVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getClaimById(expenseId));
    setRefreshing(false);
  };

  let {
    expenseId,
    expenseReportId,
    expenseDate,
    expenseAmount,
    approvedAmount,
    paidAmount,
    reference,
    description,
    claimStatusName,
    expenseAttachments,
    claimStatusNormalizedName,
    groupName,
    categoryName,
    userFirstName,
    userLastName,
  } = claimState.claim;
  const id = route.params;
  const { colors } = useAppTheme();

  const {
    colors: { onSurfaceVariant },
  } = useAppTheme();

  const onPressImage = (image: string) => {
    setModalImage(image);
    setShowModal(true);
  };
  const [approvedAmountChanged, setApprovedAmountChanged] = useState(false);
  const RBSheetRef: any = useRef(null);
  const [selectedClaim, setSelectedClaim] = useState<any>('');
  const [hideApprovedAmtTextBox, setHideApprovedAmtTextBox] = useState(true);
  const [tempApprovedAmount, setTempApprovedAmount] = useState(
    approvedAmount ? approvedAmount : expenseAmount,
  );

  const claimData: any = useAppSelector(state => state.claimReducer.allClaims);
  const [statusMessage, setStatusMessage] = useState('');

  const claimStatusData = useAppSelector(
    state => state.claimStatus.allClaimStatus,
  );

  const allClaimStatus = claimStatusData
    .filter((item: any) => {
      if (claimStatusNormalizedName === ClaimStatus.pending) {
        return item.normalizedName === ClaimStatus.submitted;
      }
      if (claimStatusNormalizedName === ClaimStatus.submitted) {
        return (
          item.normalizedName === ClaimStatus.accepted ||
          item.normalizedName === ClaimStatus.hold ||
          item.normalizedName === ClaimStatus.rejected
        );
      }
      if (claimStatusNormalizedName === ClaimStatus.hold) {
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

  useFocusEffect(
    useCallback(() => {
      dispatch(getClaimStatus());
    }, []),
  );
  const hideModal = () => {
    setShowModal(false);
  };

  const onModalCancel = () => {
    setModalImage(null);
    setShowModal(false);
  };
  const onPressEdit = async () => {
    await dispatch(getClaimInitialData(expenseId));
    await dispatch(getClaimById(id));
    navigation.navigate('addClaim', expenseId);
  };

  const onPressDelete = async () => {
    setIsDialogVisible(true);
  };

  // const onChangeStatus = async () => {
  //   let updateData = {
  //     id: id,
  //     claimObj: { claimStatusId: selectedClaim.id },
  //   };
  //   await dispatch(updateClaimAdmin(updateData));
  //   await dispatch(getClaimById(expenseId));
  //   dispatch(getClaims());
  //   setSelectedClaim('');
  // };

  const onConfirm = async () => {
    await dispatch(deleteClaim(expenseId));
    navigation.navigate('expense');
  };

  const handleApprovedAmount = (value: number) => {
    setTempApprovedAmount(value);
  };

  const handleClaimChangeStatus = async (data: any) => {
    setStatusIsDialogVisible(!isStatusDialogVisible);
    setStatusMessage(data.claimStatusName);
    setSelectedClaim(data);
  };

  const submitApprovedAmt = async () => {
    setHideApprovedAmtTextBox(true);
    setApprovedAmountChanged(true);
  };

  const changeStatusconfirm = async () => {
    const updateclaimDatareject = {
      id: expenseId,
      claimObj: {
        claimStatusId: selectedClaim.id,
      },
    };
    const updateclaimDataAccept = {
      id: expenseId,
      claimObj: {
        claimStatusId: selectedClaim.id,
        approvedAmount: tempApprovedAmount,
      },
    };
    await dispatch(
      updateClaimAdmin(
        selectedClaim.claimStatusNormalizedName === ClaimStatus.accepted
          ? updateclaimDataAccept
          : updateclaimDatareject,
      ),
    );
    await dispatch(getGroup(expenseReportId));
    await dispatch(getClaims());
    await dispatch(getClaimsByGroupId(expenseReportId));
    await dispatch(getClaimByIdAdmin(id));
    await dispatch(getClaimHistoryById(id));
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Card style={styles.cardContainer} elevation={1}>
          <Card.Title title="Expense Details" titleStyle={styles.cardTitle} />
          <Card.Content>
            {claimPermission.changeClaimStatusPermission && (
              <View style={styles.row}>
                <Label
                  title="Username"
                  value={`${userFirstName} ${userLastName}`}
                />
                <Label title="Status" value={claimStatusName} />
              </View>
            )}
            <View style={styles.row}>
              <Label
                title="Date"
                value={new Date(expenseDate).toDateString()}
              />
            </View>
            <View style={styles.row}>
              <Label title="Report Name" value={groupName} />
              <Label title="Category Name" value={categoryName} />
            </View>
            <View style={styles.row}>
              <Label title="Requested Amount" value={expenseAmount} />
              {hideApprovedAmtTextBox ? (
                <View style={styles.approveAmountEdit}>
                  <Label
                    title="Approved Amount"
                    value={
                      approvedAmount
                        ? `₹ ${approvedAmount}`
                        : approvedAmountChanged
                          ? tempApprovedAmount
                          : 'N/A'
                    }
                  />
                  {claimPermission.changeClaimStatusPermission &&
                    claimStatusNormalizedName === ClaimStatus.submitted && (
                      <PaperButton
                        icon={'pencil'}
                        children
                        onPress={() =>
                          setHideApprovedAmtTextBox(!hideApprovedAmtTextBox)
                        }></PaperButton>
                    )}
                </View>
              ) : (
                <View>
                  <Input
                    title="Approved Amount"
                    placeholder="Enter amount"
                    value={tempApprovedAmount}
                    handleChange={handleApprovedAmount}
                    keyboard="numeric"
                  />
                  <View style={styles.amountButtons}>
                    <PaperButton
                      onPress={submitApprovedAmt}
                      children
                      icon={'check-bold'}></PaperButton>
                    <PaperButton
                      onPress={() => {
                        setTempApprovedAmount(
                          approvedAmount ? approvedAmount : expenseAmount,
                        );
                        setHideApprovedAmtTextBox(!hideApprovedAmtTextBox);
                      }}
                      children
                      icon={'close-thick'}></PaperButton>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.row}>
              <Label
                title="Paid Amount"
                extraStyle={{ valueStyle: { textTransform: 'uppercase' } }}
                value={paidAmount || 'NA'}
              />
              <Label title="Reference" value={reference} />
            </View>
            <View style={styles.row}>
              <Label
                title="Description"
                extraStyle={{
                  labelStyle: { width: '60%' },
                }}
                value={description}
              />
              {claimPermission.changeClaimStatusPermission &&
                claimStatusNormalizedName === ClaimStatus.submitted && (
                  <View style={styles.buttonContainer}>
                    <IconButton
                      iconColor={onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onPressEdit()}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => onPressDelete()}
                    />
                  </View>
                )}

              {claimStatusNormalizedName === ClaimStatus.pending &&
                claimPermission.editPermission && (
                  <View style={styles.buttonContainer}>
                    <IconButton
                      iconColor={onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onPressEdit()}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => onPressDelete()}
                    />
                  </View>
                )}
            </View>
          </Card.Content>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: '5%',
            }}>
            {claimPermission.changeClaimStatusPermission &&
              claimStatusNormalizedName !== ClaimStatus.rejected &&
              allClaimStatus.map((item: any) => (
                <Button
                  key={item.id}
                  mode="contained"
                  onPress={() => handleClaimChangeStatus(item)}>
                  {(item.claimStatusName === 'Accepted' && 'Accept') ||
                    (item.claimStatusName === 'Rejected' && 'Reject') ||
                    item.claimStatusName}
                </Button>
              ))}
          </View>
          {/* {claimPermission.changeClaimStatusPermission &&
            claimStatusNormalizedName !== 'CLOSED' &&
            claimStatusNormalizedName !== 'REJECT' && (
              <View style={styles.AcceptDelete}>
                <Pressable style={styles.dropDown} onPress={handleClaimStatus}>
                  <Input
                    title="Select an action"
                    placeholder=""
                    editable={false}
                    value={selectedClaim.claimGroupStatusName}
                  />
                </Pressable>
                {selectedClaim && <SubmitButton onPress={onChangeStatus} />}
              </View>
            )} */}
        </Card>
        <Card elevation={1} style={styles.cardContainer}>
          <Card.Title titleStyle={styles.cardTitle} title="Attachments" />
          <Card.Content style={styles.attachmentContainer}>
            {expenseAttachments && expenseAttachments.length > 0 ? (
              expenseAttachments.map((item: any) => {
                return (
                  <Pressable
                    key={item.expenseAttachmentId}
                    style={styles.imageContainer}
                    onPress={() => onPressImage(item.base64Image)}>
                    <Image
                      source={{ uri: `${item.base64Image}` }}
                      style={styles.image}
                    />
                  </Pressable>
                );
              })
            ) : (
              <View>
                <Text>There are no attachments in this claim</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        <Card elevation={1} style={styles.cardContainer}>
          <Card.Title titleStyle={styles.cardTitle} title="History" />
          <Card.Content style={{ width: '103%' }}>
            {claimState.history &&
              claimState.history.map((history: any, index) => {
                let icon: any =
                  (history.claimStatusNormalizedName == ClaimStatus.pending &&
                    'book-open-variant') ||
                  (history.claimStatusNormalizedName == ClaimStatus.submitted &&
                    'book-check') ||
                  (history.claimStatusNormalizedName == ClaimStatus.accepted &&
                    'check-circle') ||
                  (history.claimStatusNormalizedName == ClaimStatus.hold &&
                    'pause') ||
                  (history.claimStatusNormalizedName == ClaimStatus.rejected &&
                    'close-circle-outline') ||
                  (history.claimStatusNormalizedName ==
                    ClaimStatus.partiallyPaid &&
                    'cash') ||
                  (history.claimStatusNormalizedName ==
                    ClaimStatus.paymentCompleted &&
                    'cash-check') ||
                  (history.claimStatusNormalizedName == ClaimStatus.partiallyPaid &&
                    'circle-half-full');
                return (
                  <View
                    key={index}
                    style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ flex: 0.1, alignItems: 'center' }}>
                      <Avatar.Icon size={30} icon={icon} />
                      {index !== claimState.history.length - 1 && (
                        <View style={styles.historyLine}></View>
                      )}
                    </View>
                    <View
                      style={[
                        styles.historyDetails,
                        { backgroundColor: colors.background },
                      ]}>
                      <View style={styles.detailsContainer}>
                        <View
                          style={[
                            styles.row,
                            { justifyContent: 'space-between', marginBottom: 5 },
                          ]}>
                          <Text>
                            {history.updatedUserName
                              ? history.updatedUserName
                              : history.createdUserName}
                          </Text>
                          <Text>{history.claimStatusName}</Text>
                        </View>
                        <View >
                          <Text>
                            {history.claimStatusNormalizedName === ClaimStatus.paymentCompleted
                              ? new Date(history.transactionOn).toDateString() : history.updatedOn
                                ? new Date(history.updatedOn).toDateString()
                                : new Date(history.createdOn).toDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
          </Card.Content>
        </Card>
      </ScrollView>
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalImageContainer}>
            {modalImage && (
              <Image
                source={{ uri: `${modalImage}` }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            <CancelButton onPress={() => onModalCancel()} />
          </View>
        </Modal>
      </Portal>

      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onConfirm()}
      />
      <DialogCard
        message={`sure you want to chnage claim status to ${statusMessage} ?`}
        isDialogVisible={isStatusDialogVisible}
        setIsDialogVisible={setStatusIsDialogVisible}
        onConfirm={() => changeStatusconfirm()}
      />
    </>
  );
};

export default ClaimDetails;

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
  },
  cardContainer: {
    margin: 10,
  },
  cardTitle: {
    fontWeight: '700',
  },
  heading: {
    fontWeight: '700',
    paddingBottom: '2%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  approveAmountEdit: {
    width: '70%',
    flexDirection: 'row',
  },
  amountButtons: {
    flexDirection: 'row',
    elevation: 6,
  },
  historyLine: {
    height: 35,
    borderColor: 'green',
    borderWidth: 1,
    width: 2,
  },
  historyDetails: {
    flex: 1,
    margin: 5,
    height: 55,
    width: '150%',
    marginTop: -10,
    borderRadius: 5,
    elevation: 3,
  },
  detailsContainer: {
    padding: 4,
  },
  dropDown: {
    width: '70%',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  AcceptDelete: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  attachmentContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  imageContainer: {
    width: '18%',
    height: width * 0.18,
    marginHorizontal: '1%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: '80%',
    height: '90%',
    padding: 10,
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  DateStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2%',
  },
});
