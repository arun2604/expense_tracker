/* eslint-disable prettier/prettier */
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GroupCard from './GroupCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  deleteGroup,
  getGroup,
  getGroupSubmitted,
  getGroups,
} from '../../features/Redux/thunks/GroupThunks';
import ScreenLoader from '../../components/loader/screenLoader';
import AddIconFAB from '../../components/FAB/addIconFAB';
// import {
//   ascendingGroup,
//   ascendingGroupByApprovedAmount,
//   ascendingGroupByEndDate,
//   ascendingGroupByRequestedAmount,
//   ascendingGroupByStartDate,
//   descendingGroup,
//   descendingGroupByApprovedAmount,
//   descendingGroupByEndDate,
//   descendingGroupByRequestedAmount,
//   descendingGroupByStartDate,
// } from '../../features/Redux/slices/GroupSlice';
// import GroupSortingMenu from './GroupSortingMenu';
import { Button, Text } from 'react-native-paper';
import { RefreshControl } from 'react-native-gesture-handler';
// import Permissions from '../../utilities/Permissions';
import { getClaimGroupStatus } from '../../features/Redux/thunks/ClaimGroupStatusThunk';
import Modules from '../../utilities/Modules';
import GroupStatus from '../../utilities/GroupStatus';
import NoDataCard from '../../components/NoDataCard/NoDataCard';

const Groups = ({ route }: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef();
  let initialActiveTab = route.params || 'ALL';
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const groupState = useAppSelector(state => state.group);
  const group = route.params ? route.params : '';
  // const [visible, setVisible] = useState(false);
  // const [activeSortingMenu, setActiveSortingMenu] = useState('');

  const permissions = useAppSelector(state => state.profile.permissions);
  const profileDetails: any = useAppSelector(state => state.profile.profile);
  const claimGroupStatus = useAppSelector(
    state => state.claimGroupStatus.claimGroupStatus,
  );

  useEffect(() => {
    dispatch(getClaimGroupStatus());
  }, []);

  const groupPermission: any = permissions.find(
    (each: any) => each.module === Modules.group,
  );
  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );

  const PermissionsForGroupFetch = {
    datas: [
      GroupStatus.approved,
      GroupStatus.submitted,
      GroupStatus.closed,
      GroupStatus.hold,
      GroupStatus.partially_paid,
      GroupStatus.reimbursed,
      GroupStatus.rejected,
    ],
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    groupPermission.changeGroupStatusPermission
      ? dispatch(getGroupSubmitted(PermissionsForGroupFetch))
      : dispatch(getGroups());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      groupPermission.changeGroupStatusPermission
        ? dispatch(getGroupSubmitted(PermissionsForGroupFetch))
        : dispatch(getGroups());
    }, [group]),
  );

  const convertDate = (startingDate: Date, endingDate: Date) => {
    let startDate = new Date(startingDate);
    let endDate = new Date(endingDate);
    let convertedDate = `${startDate
      .toDateString()
      .split(' ')
      .slice(1)
      .join(' ')} - ${endDate.toDateString().split(' ').slice(1).join(' ')}`;
    return convertedDate;
  };

  const onEdit = async (id: number) => {
    await dispatch(getGroup(id));
    let selectedExpAllDetails: any = []
    navigation.navigate('addGroup', { id: id, selectedExpAllDetails });
  };

  const onDelete = (id: number) => {
    dispatch(deleteGroup(id));
  };

  const onFABPress = () => {
    let selectedExpAllDetails: any = []
    navigation.navigate('addGroup', { selectedExpAllDetails });
  };

  // const alphabetAscending = () => {
  //   dispatch(ascendingGroup());
  //   setActiveSortingMenu('alphabetAscending');
  //   setVisible(false);
  // };

  // const alphabetDescending = () => {
  //   dispatch(descendingGroup());
  //   setActiveSortingMenu('alphabetDescending');
  //   setVisible(false);
  // };

  // const reqAmountAscending = () => {
  //   dispatch(ascendingGroupByRequestedAmount());
  //   setActiveSortingMenu('reqAmountAscending');
  //   setVisible(false);
  // };

  // const reqAmountDescending = () => {
  //   dispatch(descendingGroupByRequestedAmount());
  //   setActiveSortingMenu('reqAmountDescending');
  //   setVisible(false);
  // };

  // const apprAmountAscending = () => {
  //   dispatch(ascendingGroupByApprovedAmount());
  //   setActiveSortingMenu('apprAmountAscending');
  //   setVisible(false);
  // };

  // const apprAmountDescending = () => {
  //   dispatch(descendingGroupByApprovedAmount());
  //   setActiveSortingMenu('apprAmountDescending');
  //   setVisible(false);
  // };

  // const startDateAscending = () => {
  //   dispatch(ascendingGroupByStartDate());
  //   setActiveSortingMenu('startDateAscending');
  //   setVisible(false);
  // };

  // const startDateDescending = () => {
  //   dispatch(descendingGroupByStartDate());
  //   setActiveSortingMenu('startDateDescending');
  //   setVisible(false);
  // };

  // const endDateAscending = () => {
  //   dispatch(ascendingGroupByEndDate());
  //   setActiveSortingMenu('endDateAscending');
  //   setVisible(false);
  // };

  // const endDateDescending = () => {
  //   dispatch(descendingGroupByEndDate());
  //   setActiveSortingMenu('endDateDescending');
  //   setVisible(false);
  // };

  let filteredReports: any = [];
  if (activeTab === 'ALL') {
    filteredReports = groupState.groups;
  } else {
    filteredReports = groupState.groups
      ? groupState.groups.filter(
        (item: any) => item.claimGroupStatusNormalizedName === activeTab,
      )
      : [];
  }

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      flexDirection: 'column',
      height: '100%',
    },
    tabCard: {
      marginBottom: 15,
    },
    tabButton: {
      borderColor: `${activeTab === 'ALL' ? 'green' : 'transparent'}`,
    },
    tabButtonText: { color: `${activeTab === 'ALL' ? 'green' : 'gray'}` },
    reportsCard: {
      flexDirection: 'column',
      flex: 1,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
    sorting: {
      marginLeft: 'auto',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabCard}>
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <Button
            style={styles.tabButton}
            labelStyle={styles.tabButtonText}
            onPress={() => setActiveTab('ALL')}
            mode="outlined">
            All
          </Button>
          {claimGroupStatus.map((item: any) => (
            <Button
              key={item.claimGroupStatusId}
              style={{
                borderColor: `${activeTab === item.normalizedName ? 'green' : 'transparent'
                  }`,
              }}
              labelStyle={{
                color: `${activeTab === item.normalizedName ? 'green' : 'gray'
                  }`,
              }}
              onPress={() => setActiveTab(item.normalizedName)}
              mode="outlined">
              {item.name}
            </Button>
          ))}
        </ScrollView>
      </View>
      <View style={styles.reportsCard}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/* <View style={styles.sorting}>
          <GroupSortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
            startDateAscending={startDateAscending}
            startDateDescending={startDateDescending}
            endDateAscending={endDateAscending}
            endDateDescending={endDateDescending}
            reqAmountAscending={reqAmountAscending}
            reqAmountDescending={reqAmountDescending}
            apprAmountAscending={apprAmountAscending}
            apprAmountDescending={apprAmountDescending}
            activeMenu={activeSortingMenu}
          />
        </View> */}
          {filteredReports.length > 0 ? (
            filteredReports.map((group: any) => {
              return (
                <GroupCard
                  name={group.name}
                  dateRange={convertDate(group.startDate, group.endDate)}
                  requestedAmount={group.requestedAmount}
                  approvedAmount={group.approvedAmount}
                  description={group.description}
                  id={group.expenseReportId}
                  key={group.expenseReportId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  status={group.claimGroupStatusName}
                  claimStatusId={group.claimGroupStatusId}
                  username={group.userFirstName + group.userLastName}
                  roleName={profileDetails.roleName}
                />
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
      </View>
      {groupState.isLoading && <ScreenLoader visible={groupState.isLoading} />}
      {groupPermission.addPermission &&
        !claimPermission.changeClaimStatusPermission && (
          <AddIconFAB onPress={onFABPress} />
        )}
    </View>
  );
};

export default Groups;
