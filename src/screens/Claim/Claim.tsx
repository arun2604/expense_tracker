/* eslint-disable prettier/prettier */
import { Dimensions, View } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import ClaimCard from './ClaimCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  deleteClaim,
  getClaimById,
  getClaimInitialData,
  getClaims,
} from '../../features/Redux/thunks/ClaimThunk';
import { ScrollView } from 'react-native';
import ScreenLoader from '../../components/loader/screenLoader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AddIconFAB, { CreateReportFAB } from '../../components/FAB/addIconFAB';
// import {
//   ascendingClaimByApprovedAmount,
//   ascendingClaimByDate,
//   ascendingClaimByRequestedAmount,
//   descendingClaimByApprovedAmount,
//   descendingClaimByDate,
//   descendingClaimByRequestedAmount,
// } from '../../features/Redux/slices/ClaimSlice';
import { RefreshControl, State } from 'react-native-gesture-handler';
import { getClaimStatus } from '../../features/Redux/thunks/ClaimStatusThunk';
import { Checkbox, Portal, Modal, Text, FAB, Snackbar } from 'react-native-paper';
import Modules from '../../utilities/Modules';
import NoDataCard from '../../components/NoDataCard/NoDataCard';
import {
  getGroups,
  multipleExpenseSelected,
} from '../../features/Redux/thunks/GroupThunks';
import GroupStatus from '../../utilities/GroupStatus';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useAppTheme } from '../../../App';
import { SubmitButton } from '../../components/button/Button';
import { Pressable } from 'react-native';
import Label from '../../components/label/label';

const Claim = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const claimData: any = useAppSelector(state => state.claimReducer.allClaims);
  const isLoading: any = useAppSelector(state => state.claimReducer.isLoading);
  // const [visible, setVisible] = useState(false);
  // const [activeSortingMenu, setActiveSortingMenu] = useState('');

  const permissions = useAppSelector(state => state.profile.permissions);
  const profileDetails: any = useAppSelector(state => state.profile.profile);
  const groupState = useAppSelector(state => state.group.groups);
  const [selectedExpAllDetails, setSelectedExpAllDetails] = useState<any>([])
  const availableReports: any = groupState
    .filter((exp: any) => {
      return exp.claimGroupStatusNormalizedName === GroupStatus.new;
    })
    .map((exp: any) => {
      return {
        reportName: exp.name,
        claimGroupStatusNormalizedName: exp.claimGroupStatusNormalizedName,
        id: exp.expenseReportId,
        expenseAmount: exp.requestedAmount,
        startDate: exp.startDate,
        endDate: exp.endDate,
      };
    });

  const {
    colors: { primaryContainer, outline, background },
  } = useAppTheme();

  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );

  const [visible, setVisible] = React.useState(false);
  const [selectedReport, setSelectedReport] = useState<any>();
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const onDismissSnackBar = () => setVisibleSnackbar(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const claimStatus = useAppSelector(state => state.claimStatus.allClaimStatus);
  let initialActiveTab = route.params || 'ALL';
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const scrollViewRef = useRef();
  const claims = claimData.filter((exp: any) => {
    return exp.expenseReportId === null;
  });

  const [selectedExp, setSelectedExp] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setActiveTab(initialActiveTab);
    const index = claimStatus.findIndex(
      (each: any) => each.normalizedName === activeTab,
    );
    const x = index * 80;
    if (scrollViewRef.current) {
      const { scrollTo }: any = scrollViewRef.current;
      scrollTo({ x, animated: true });
    }
  }, [initialActiveTab, claimStatus]);

  useEffect(() => {
    dispatch(getClaims());
    dispatch(getClaimStatus());
    dispatch(getGroups());
  }, []);

  const onEdit = async (id: number) => {
    await dispatch(getClaimInitialData(id));
    await dispatch(getClaimById(id));
    navigation.navigate('addClaim', id);
  };
  const onDelete = (id: number) => {
    dispatch(deleteClaim(id));
  };

  const onFABPress = async () => {
    await dispatch(getClaimInitialData(null));
    navigation.navigate('addClaim');
  };

  const handleCheckBox = (item: any, index: number) => {
    let newCheckd = [...checked];
    newCheckd[index] = !newCheckd[index];
    setChecked(newCheckd);
    let indexOfExp = selectedExp.findIndex(
      (exp: number) => exp === Number(item.expenseId),
    );

    if (indexOfExp === -1) {
      setSelectedExp((prev: any) => [...prev, Number(item.expenseId)]);
      setSelectedExpAllDetails((prev: any) => [
        ...prev, item.expenseDate
      ])
    }
    else {
      let newSelectedExp = [...selectedExp];
      newSelectedExp.splice(indexOfExp, 1);
      setSelectedExp(newSelectedExp);
      let newAllDetails = [...selectedExpAllDetails]
      newAllDetails.splice(indexOfExp, 1)
      setSelectedExpAllDetails(newAllDetails)
    }
  };

  // const dateAscending = () => {
  //   dispatch(ascendingClaimByDate());
  //   setActiveSortingMenu('dateAscending');
  //   setVisible(false);
  // };

  // const dateDescending = () => {
  //   dispatch(descendingClaimByDate());
  //   setActiveSortingMenu('dateDescending');
  //   setVisible(false);
  // };

  // const reqAmountAscending = () => {
  //   dispatch(ascendingClaimByRequestedAmount());
  //   setActiveSortingMenu('reqAmountAscending');
  //   setVisible(false);
  // };

  // const reqAmountDescending = () => {
  //   dispatch(descendingClaimByRequestedAmount());
  //   setActiveSortingMenu('reqAmountDescending');
  //   setVisible(false);
  // };

  // const apprAmountAscending = () => {
  //   dispatch(ascendingClaimByApprovedAmount());
  //   setActiveSortingMenu('apprAmountAscending');
  //   setVisible(false);
  // };

  // const apprAmountDescending = () => {
  //   dispatch(descendingClaimByApprovedAmount());
  //   setActiveSortingMenu('apprAmountDescending');
  //   setVisible(false);
  // };
  let filteredClaims: any = [];
  if (activeTab === 'ALL') {
    filteredClaims = claimData;
  } else {
    filteredClaims = claimData
      ? claimData.filter(
        (item: any) => item.claimStatusNormalizedName === activeTab,
      )
      : [];
  }

  const isNotInReport = filteredClaims.some(
    (exp: any) => exp.expenseReportId === null,
  );
  const [checked, setChecked] = useState(
    filteredClaims
      .filter((exp: any) => {
        return exp.expenseReportId === null;
      })
      .map((exp: any) => {
        return false;
      }),
  );

  useFocusEffect(
    useCallback(() => {
      setChecked(filteredClaims
        .filter((exp: any) => {
          return exp.expenseReportId === null;
        })
        .map((exp: any) => {
          return false;
        }))
      setSelectedExp([])
    }, [])
  )

  const handleSelectedReport = (exp: any) => {
    setSelectedReport(exp);
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getClaims());
    setRefreshing(false);
    setChecked(
      filteredClaims
        .filter((exp: any) => {
          return exp.expenseReportId === null;
        })
        .map((exp: any) => {
          return false;
        }),
    );
    setSelectedExp([]);
  };
  const handleAddToReport = () => {
    showModal();
  };
  const handleNewReport = () => {
    navigation.navigate('addGroup', { selectedExp, id: 0, selectedExpAllDetails });
    setVisible(false)
  };

  const handleMultipleExpenseSelct = async () => {
    let isWithiniReportDate = false;
    selectedExpAllDetails.forEach((date: Date) => {
      if (date < selectedReport.endDate && date > selectedReport.startDate) {
        isWithiniReportDate = true
      }
    })
    if (isWithiniReportDate) {
      let data = {
        id: selectedReport.id,
        selectedExp,
      };
      let result = await dispatch(multipleExpenseSelected(data));
      if (result.payload.resultCode === 200) {
        setVisible(false);
        await dispatch(getClaims());
      }
    }
    else {
      setSnackbarMsg('Expense date is not suitable for selcted report');
      setVisibleSnackbar(true)
    }
  };

  return (
    <View style={style.claimContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={style.sorting}>
          <ClaimSortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            dateAscending={dateAscending}
            dateDescending={dateDescending}
            reqAmountAscending={reqAmountAscending}
            reqAmountDescending={reqAmountDescending}
            apprAmountAscending={apprAmountAscending}
            apprAmountDescending={apprAmountDescending}
            activeMenu={activeSortingMenu}
          />
        </View> */}
        {/* <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={style.tabCard}>
          <Button
            style={[
              style.tabButton,
              {borderColor: `${activeTab === 'ALL' ? 'green' : 'transparent'}`},
            ]}
            labelStyle={{
              color: `${activeTab === 'ALL' ? 'green' : 'gray'}`,
            }}
            onPress={() => setActiveTab('ALL')}
            mode="text">
            All
          </Button>
          {claimStatus.map((item: any) => (
            <Button
              key={item.claimStatusId}
              style={[
                style.tabButton,
                {
                  borderColor: `${activeTab === item.normalizedName ? 'green' : 'transparent'
                    }`,
                },
              ]}
              labelStyle={{
                color: `${activeTab === item.normalizedName ? 'green' : 'gray'
                  }`,
              }}
              onPress={() => setActiveTab(item.normalizedName)}
              mode="text">
              {item.name}
            </Button>
          ))}
        </ScrollView> */}
        {isNotInReport ? (
          filteredClaims.map((item: any, index: number) => {
            let newDescription = item.description;
            if (newDescription.length > 30) {
              newDescription = newDescription.slice(0, 26) + '....';
            }
            return (
              !item.expenseReportName && (
                <View key={item.expenseId} style={style.innerClaimContainer}>
                  <ClaimCard
                    id={item.expenseId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    date={item.expenseDate}
                    claimStatusId={item.claimStatusId}
                    claimStatusName={item.claimStatusName}
                    claimStatusColor={item.claimStatusColor}
                    expenseAmount={item.expenseAmount}
                    approvedAmount={item.approvedAmount}
                    paidAmount={item.paidAmount}
                    description={newDescription}
                    expenseReportName={item.expenseReportName}
                    claimStatusNormalizedName={item.claimStatusNormalizedName}
                    username={item.userFirstName + item.userLastName}
                    roleName={profileDetails.roleName}
                  />
                  {!claimPermission.changeClaimStatusPermission && (
                    <View style={{ justifyContent: 'center' }}>
                      <Checkbox
                        status={checked[index] ? 'checked' : 'unchecked'}
                        onPress={() => handleCheckBox(item, index)}
                      />
                    </View>
                  )}
                </View>
              )
            );
          })
        ) : (
          <View
            style={{
              height: Dimensions.get('screen').height - 200,
              width: '100%',
            }}>
            <NoDataCard />
          </View>
        )}
      </ScrollView>
      {isLoading && <ScreenLoader visible={isLoading} />}
      {claimPermission.addPermission &&
        !claimPermission.changeClaimStatusPermission &&
        selectedExp.length == 0 && <AddIconFAB onPress={onFABPress} />}

      {claimPermission.addPermission &&
        !claimPermission.changeClaimStatusPermission &&
        selectedExp.length > 0 && (
          <CreateReportFAB onPress={handleAddToReport} />
        )}
      {visible && (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={style.modalContainer}>
            {availableReports.length > 0 ? <ScrollView
              contentContainerStyle={{ padding: '3%', alignItems: 'flex-start' }}>
              {availableReports &&
                availableReports.map((exp: any, index: number) => {
                  return (
                    <Pressable
                      style={{
                        width: '100%',
                        backgroundColor:
                          selectedReport && selectedReport.reportName == exp.reportName
                            ? primaryContainer
                            : background,
                        borderRadius: 10,
                      }}
                      key={index}
                      onPress={() => handleSelectedReport(exp)}>
                      <View
                        style={[
                          style.reportContainer,
                          { borderColor: outline, borderRadius: 5 },
                        ]}>
                        <Label title="Report name" value={exp.reportName} />
                        <View style={{ flexDirection: 'row' }}>
                          <Label
                            title="Start Date"
                            value={new Date(exp.startDate).toDateString()}
                          />
                          <Label
                            title="End Date"
                            value={new Date(exp.endDate).toDateString()}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
            </ScrollView> :
              <Text style={{ marginTop: '5%' }}>No reports available...</Text>}
            <View>
              <FAB
                style={[style.reportFab, {
                  marginBottom: availableReports.length > 0 ? '2%' : 0
                }]}
                icon="plus"
                onPress={handleNewReport}
              />
            </View>
            {availableReports.length > 0 && (
              <SubmitButton onPress={handleMultipleExpenseSelct} />
            )}
          </Modal>
        </Portal>
      )}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={onDismissSnackBar}
        duration={2500}
        action={{
          label: 'Cancel',
        }}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

const style = StyleSheet.create({
  claimContainer: {
    height: '100%',
    width: '100%',
  },
  fab: {
    bottom: '5%',
  },
  reportFab: {
    position: 'absolute',
    bottom: 5,
    right: 0,
  },
  reportContainer: {
    borderWidth: 1,
    margin: '5%',
    padding: '3%',
  },
  sorting: {
    marginLeft: 'auto',
  },
  tabCard: {
    margin: 10,
  },
  tabButton: {
    borderWidth: 1,
  },
  innerClaimContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    marginLeft: '3%',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: '5%',
    padding: '5%',
    marginVertical: '15%',
    borderRadius: widthPercentageToDP(4),
    justifyContent: 'space-around',
    minHeight: '14%'
  },
  modalButton: {
    marginBottom: '2%',
    paddingHorizontal: '2%',
  },
});

export default Claim;
