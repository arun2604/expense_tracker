import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, IconButton, Text } from 'react-native-paper';
import { useAppTheme } from '../../../App';
import DashboardCard from './dashboardCard';
import CountCard from './countCard';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { getDashboardDetails } from '../../features/Redux/thunks/DashboardThunks';
import { RefreshControl } from 'react-native-gesture-handler';
import Modules from '../../utilities/Modules';
import AccountDetailsCard from './AccountDetailsCard';
import ClaimStatus from '../../utilities/ClaimStatus';
import GroupStatus from '../../utilities/GroupStatus';

const Dashboard = () => {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getDashboardDetails());
    setRefreshing(false);
  };

  const { dashboardData, isLoading } = useAppSelector(state => state.dashboard);
  const {
    firstName,
    lastName,
    roleName,
    totalRequestedAmount,
    totalApprovedAmount,
    expenseReportByStatus,
    advanceAmount,
    claimAmount,
  } = dashboardData;
  const permissions = useAppSelector(state => state.profile.permissions);
  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getDashboardDetails());
    }, []),
  );

  return (
    <ScrollView
      style={[{ backgroundColor: colors.surface }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={[
          styles.userWrapper,
          { backgroundColor: colors.dashBoardPrimary },
        ]}>
        <View style={[styles.row, styles.userContainer]}>
          <View>
            <Text variant="displaySmall">
              Hi, {`${firstName} ${lastName ? lastName : ''}`}
            </Text>
          </View>
          {/* <View style={styles.bellContainer}>
            <IconButton
              icon="bell"
              style={styles.bellIcon}
              iconColor={colors.primary}
              onPress={() => console.log('Pressed')}
            />
          </View> */}
        </View>
        <View style={styles.claimDetailsContainer}>
          <Text style={{ color: colors.secondary }} variant="titleLarge">
            Claim Details
          </Text>
        </View>
        <View style={[styles.row, styles.amountWrapper]}>
          <View>
            <Text
              style={{ color: colors.onPrimaryContainer }}
              variant="displayMedium">
              &#x20B9; {totalRequestedAmount}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={{ color: colors.secondary }} variant="titleMedium">
              Submitted
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.amountWrapper]}>
          <View>
            <Text
              style={{ color: colors.onPrimaryContainer }}
              variant="displayMedium">
              &#x20B9; {totalApprovedAmount}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text variant="titleMedium" style={{ color: colors.secondary }}>
              Approved
            </Text>
          </View>
        </View>
      </View>
      <AccountDetailsCard
        accountDetails={{ advanceAmount, claimAmount }}
        roleName={roleName}
      />
      <View>
        <ScrollView
          horizontal
          persistentScrollbar
          contentContainerStyle={[styles.row, styles.countContainer]}>
          {claimPermission && !claimPermission.changeClaimStatusPermission && (
            <CountCard title="New" count={expenseReportByStatus.new.total} />
          )}
          <CountCard
            title="Submitted"
            count={expenseReportByStatus.submitted.total}
          />
          <CountCard title="Hold" count={expenseReportByStatus.hold.total} />
          <CountCard
            title="Approved"
            count={expenseReportByStatus.approved.total}
          />
          <CountCard
            title="Rejected"
            count={expenseReportByStatus.rejected.total}
          />
          <CountCard
            title="Partially Paid"
            count={expenseReportByStatus.partiallyPaid.total}
          />
          <CountCard
            title="Paid"
            count={expenseReportByStatus.reimbursed.total}
          />
          <CountCard
            title="Closed"
            count={expenseReportByStatus.closed.total}
          />
        </ScrollView>
        {expenseReportByStatus.new.data.length > 0 && claimPermission &&
          !claimPermission.changeClaimStatusPermission && (
            <View>
              <DashboardCard
                list={expenseReportByStatus.new.data}
                cardTitle="Reports yet to be submitted"
                roleName={roleName}
                seeAllPage={GroupStatus.new}
              />
            </View>
          )}
        {expenseReportByStatus.submitted.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.submitted.data}
              cardTitle="Submitted Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.submitted}
            />
          </View>
        )}
        {expenseReportByStatus.hold.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.hold.data}
              cardTitle="Reports on Hold"
              roleName={roleName}
              seeAllPage={GroupStatus.hold}
            />
          </View>
        )}
        {expenseReportByStatus.approved.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.approved.data}
              cardTitle="Approved Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.approved}
            />
          </View>
        )}
        {expenseReportByStatus.rejected.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.rejected.data}
              cardTitle="Rejected Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.rejected}
            />
          </View>
        )}
        {expenseReportByStatus.partiallyPaid.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.partiallyPaid.data}
              cardTitle="Partially Paid Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.partially_paid}
            />
          </View>
        )}
        {expenseReportByStatus.reimbursed.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.reimbursed.data}
              cardTitle="Paid Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.reimbursed}
            />
          </View>
        )}
        {expenseReportByStatus.closed.data.length > 0 && (
          <View>
            <DashboardCard
              list={expenseReportByStatus.closed.data}
              cardTitle="Closed Reports"
              roleName={roleName}
              seeAllPage={GroupStatus.closed}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  userWrapper: {
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  bellContainer: {
    marginLeft: 'auto',
  },
  bellIcon: {
    borderRadius: 0,
  },
  claimDetailsContainer: {
    marginVertical: 20,
  },
  amountWrapper: {
    alignItems: 'baseline',
    paddingVertical: 10,
  },
  amountContainer: {
    marginHorizontal: 10,
  },
  countContainer: {
    // justifyContent: 'center',
  },
  historyContainer: {
    justifyContent: 'space-between',
    padding: 10,
  },
});
