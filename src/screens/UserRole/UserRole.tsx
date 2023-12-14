/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {useFocusEffect} from '@react-navigation/native';
import {
  deleteUserRole,
  getInitialData,
  getUserRoles,
} from '../../features/Redux/thunks/UserRoleThunks';
import UserRoleCard from './UserRoleCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AddIconFAB from '../../components/FAB/addIconFAB';
import SortingMenu from '../../components/menu/sortingMenu';
import {
  ascendingUserRole,
  descendingUserRole,
} from '../../features/Redux/slices/UserRoleSlice';
import {initialData} from '../../features/Redux/thunks/UserThunks';
import {Text} from 'react-native-paper';
import {RefreshControl} from 'react-native-gesture-handler';
import Modules from '../../utilities/Modules';

const UserRole = ({route}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const userRoleState = useAppSelector(state => state.userRole);
  const role = route.params ? route.params : '';

  const permissions = useAppSelector(state => state.profile.permissions);
  const userRolePermission: any = permissions.find(
    (each: any) => each.module === Modules.userRole,
  );

  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUserRoles());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserRoles());
    }, [role]),
  );

  const onEdit = (id: number) => {
    dispatch(getInitialData(id))
      .then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          navigation.navigate('addUserRole', id);
        }
      })
      .catch(error => console.log(error));
  };

  const onDelete = async (id: number) => {
    await dispatch(deleteUserRole(id));
  };

  const onFABPress = () => {
    dispatch(getInitialData(0))
      .then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          navigation.navigate('addUserRole');
        }
      })
      .catch(error => console.log(error));
  };

  const alphabetAscending = () => {
    dispatch(ascendingUserRole());
    setVisible(false);
  };

  const alphabetDescending = () => {
    dispatch(descendingUserRole());
    setVisible(false);
  };

  const onClickCard = async (id: number) => {
    userRolePermission.viewPermission &&
      navigation.navigate('userRoleDetails', id);
  };

  return (
    <View>
      <ScrollView
        style={styles.wrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={styles.sorting}>
          <SortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
          />
        </View> */}
        {userRoleState.userRole ? (
          userRoleState.userRoles.map((item: any) => {
            return (
              <UserRoleCard
                key={item.roleId}
                name={item.name}
                id={item.roleId}
                onEdit={onEdit}
                onDelete={onDelete}
                onClickCard={onClickCard}
              />
            );
          })
        ) : (
          <Text>No UserRole data available</Text>
        )}
      </ScrollView>
      {userRolePermission.addPermission && <AddIconFAB onPress={onFABPress} />}
    </View>
  );
};

export default UserRole;

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
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
