import React from 'react';
import {Card, Text} from 'react-native-paper';
import {View, StyleSheet, Pressable} from 'react-native';
import {useAppTheme} from '../../../App';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getClaimById,
  getClaimHistoryById,
  getClaims,
} from '../../features/Redux/thunks/ClaimThunk';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Modules from '../../utilities/Modules';
import UserRoles from '../../utilities/UserRoles';
import Label from '../../components/label/label';
import {
  getClaimsByGroupId,
  getGroup,
  getGroups,
} from '../../features/Redux/thunks/GroupThunks';

interface props {
  cardTitle: string;
  roleName: string;
  list: [];
  seeAllPage: string;
}

const DashboardCard = (props: props): JSX.Element => {
  const {cardTitle, roleName, list, seeAllPage} = props;
  const {colors} = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const permissions = useAppSelector(state => state.profile.permissions);
  const groupPermission: any = permissions.find(
    (each: any) => each.module === Modules.group,
  );

  const handleViewReport = async (id: number) => {
    if (groupPermission.viewPermission) {
      groupPermission.changeGroupStatusPermission
        ? await dispatch(getClaimsByGroupId(id))
        : await dispatch(getClaimsByGroupId(id));
      await dispatch(getGroup(id));
      navigation.navigate('groupDetails', {id: id});
    }
  };

  const handleSeeAllClaim = () => {
    if (groupPermission.listPermission) {
      dispatch(getGroups()).then(res => {
        if (res.payload.status) {
          navigation.navigate('reports', seeAllPage);
        }
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: 10,
      marginTop: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    headerName: {
      fontWeight: '700',
    },
    navigateText: {
      textDecorationLine: 'underline',
    },
    card: {
      padding: 10,
      backgroundColor: colors.dashBoardPrimary,
      borderRadius: 10,
      marginVertical: 5,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerName}>
          {cardTitle}
        </Text>
        <Pressable onPress={handleSeeAllClaim}>
          <Text variant="labelMedium" style={styles.navigateText}>
            See all
          </Text>
        </Pressable>
      </View>
      {list.map((item: any) => {
        return (
          <Pressable
            key={item.expenseReportId}
            style={styles.card}
            onPress={() => handleViewReport(item.expenseReportId)}>
            {groupPermission && groupPermission.changeGroupStatusPermission && (
              <Text variant="titleMedium" style={{marginBottom: 10}}>
                {`${item.userFirstName} ${
                  item.userLastName ? item.userLastName : ''
                }`}
              </Text>
            )}
            <View style={[styles.row, {marginBottom: 10}]}>
              <Text variant="titleMedium">
                {new Date(item.startDate).toDateString()}
              </Text>
              <Text variant="titleMedium" style={{textTransform: 'capitalize'}}>
                {item.name}
              </Text>
            </View>
            <View style={styles.row}>
              <Label
                title="Req Amount"
                value={item.requestedAmount || 'N/A'}
                extraStyle={{labelStyle: {width: '33%'}}}
              />
              <Label
                title="Approved Amount"
                value={item.approvedAmount || `N/A`}
                extraStyle={{labelStyle: {width: '33%'}}}
              />
              <Label
                title="Paid Amount"
                value={item.paidAmount || 'N/A'}
                extraStyle={{labelStyle: {width: '33%'}}}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default DashboardCard;
