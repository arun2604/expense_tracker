/* eslint-disable prettier/prettier */
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import ScreenLoader from '../../components/loader/screenLoader';
import PermissionCard from './PermissionCard';
import { Text } from 'react-native-paper';
import { Theme } from '../../theme/Theme';
import {
  getPermission,
  getPermissions,
} from '../../features/Redux/thunks/PermissionThunk';
import {
  ascendingPermission,
  descendingPermission,
} from '../../features/Redux/slices/PermissionSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AddIconFAB from '../../components/FAB/addIconFAB';
import SortingMenu from '../../components/menu/sortingMenu';
import * as userPermissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';

const Permissions = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [visible, setVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getPermissions());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getPermissions());
    }, []),
  );

  const permissionData = useAppSelector(state => state.permission);
  const userPermissionsList = useAppSelector(
    state => state.profile.permissions,
  );
  const permissionList: any = userPermissionsList.find(
    (each: any) => each.module === Modules.permission,
  );

  const onEdit = (id: number) => {
    dispatch(getPermission(id))
      .then(
        data =>
          data.meta.requestStatus === 'fulfilled' &&
          navigation.navigate('addPermission', id),
      )
      .catch(err => console.log(err));
  };

  const onFABPress = () => {
    navigation.navigate('addPermission');
  };

  const alphabetAscending = () => {
    dispatch(ascendingPermission());
    setVisible(false);
  };

  const alphabetDescending = () => {
    dispatch(descendingPermission());
    setVisible(false);
  };

  return (
    <View style={{ paddingBottom: 10 }}>
      <ScrollView
        style={[style.wrapper]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={style.sorting}>
          <SortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
          />
        </View> */}
        {permissionData ? (
          permissionData.permissions.map((item: any) => {
            return (
              <PermissionCard
                key={item.permissionId}
                id={item.permissionId}
                name={item.name}
                onEdit={onEdit}
                isSwitchOn={item.isActive == 1}
              />
            );
          })
        ) : (
          <Text>No Permission data available</Text>
        )}
      </ScrollView>
      {permissionData.isLoading && (
        <ScreenLoader visible={permissionData.isLoading} />
      )}
      {permissionList.addPermission && <AddIconFAB onPress={onFABPress} />}
    </View>
  );
};
const style = StyleSheet.create({
  fab: {
    bottom: '5%',
  },
  wrapper: {
    height: '100%',
    padding: 10,
  },
  sorting: {
    marginLeft: 'auto',
  },
});

export default Permissions;
