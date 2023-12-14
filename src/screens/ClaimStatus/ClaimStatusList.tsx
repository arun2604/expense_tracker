/* eslint-disable prettier/prettier */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import ScreenLoader from '../../components/loader/screenLoader';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ClaimStatusCard from './ClaimStatusCard';
import AddIconFAB from '../../components/FAB/addIconFAB';
import {
  ascendingClaimStatus,
  descendingClaimStatus,
} from '../../features/Redux/slices/ClaimStatusSlice';
import {Text} from 'react-native-paper';
import Modules from '../../utilities/Modules';
import {
  getClaimGroupStatus,
  getClaimGroupStatusById,
} from '../../features/Redux/thunks/ClaimGroupStatusThunk';

const ClaimStatusList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  const claimGroupStatus = useAppSelector(
    state => state.claimGroupStatus.claimGroupStatus,
  );
  const permissions = useAppSelector(state => state.profile.permissions);

  const isLoading = useAppSelector(state => state.claimStatus.isLoading);
  const [visible, setVisible] = useState(false);
  const [activeSortingMenu, setActiveSortingMenu] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  // const hasViewClaimStatusPermission = permissions.some(
  //   (eachItem: any) => eachItem.name === Permissions.viewClaimStatus,
  // );

  const claimStatusPermissions: any = permissions.find(
    (each: any) => each.module === Modules.claimStatus,
  );

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getClaimGroupStatus());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getClaimGroupStatus());
    }, []),
  );

  const onEdit = (id: number) => {
    dispatch(getClaimGroupStatusById(id)).then(res => {
      if (res.payload.status) {
        navigation.navigate('addClaimStatus', id);
      }
    });
  };

  const onFABPress = () => {
    navigation.navigate('addClaimStatus');
  };
  const alphabetAscending = () => {
    dispatch(ascendingClaimStatus());
    setActiveSortingMenu('alphabetAscending');
    setVisible(false);
  };

  const alphabetDescending = () => {
    dispatch(descendingClaimStatus());
    setActiveSortingMenu('alphabetDescending');
    setVisible(false);
  };

  return (
    <View>
      <ScrollView
        style={style.wrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={style.sorting}>
          <ClaimStatusSortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
            activeMenu={activeSortingMenu}
          />
        </View> */}
        {claimGroupStatus ? (
          claimGroupStatus.map((item: any) => {
            return (
              <ClaimStatusCard
                key={item.claimGroupStatusId}
                id={item.claimGroupStatusId}
                name={item.name}
                onEdit={onEdit}
                isSwitchOn={item.isActive == 1}
              />
            );
          })
        ) : (
          <Text>No ClaimStatus data available</Text>
        )}
      </ScrollView>
      {isLoading && <ScreenLoader visible={isLoading} />}
      {claimStatusPermissions.addPermission && (
        <AddIconFAB onPress={onFABPress} />
      )}
    </View>
  );
};
const style = StyleSheet.create({
  fab: {
    bottom: '5%',
  },
  wrapper: {
    height: '100%',
  },
  sorting: {
    marginLeft: 'auto',
  },
});

export default ClaimStatusList;
