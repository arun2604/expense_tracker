import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, ToastAndroid} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getAllUsers,
  initialData,
  deleteUser,
} from '../../features/Redux/thunks/UserThunks';
import UserCard from './UserCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AddIconFAB from '../../components/FAB/addIconFAB';
import SearchBar from '../../components/SearchBar';
import {Text} from 'react-native-paper';
import {Keyboard} from 'react-native';
import Permissions from '../../utilities/Permissions';
import {RefreshControl} from 'react-native-gesture-handler';
import Modules from '../../utilities/Modules';
import NoDataCard from '../../components/NoDataCard/NoDataCard';
import {Dimensions} from 'react-native';

const Users = ({route}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userState = useAppSelector(state => state.user);
  const permissions = useAppSelector(state => state.profile.permissions);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllUsers(searchInput));
    setRefreshing(false);
  };

  const userData = route.params ? route.params : '';

  useEffect(() => {
    dispatch(getAllUsers(searchInput));
  }, [userData]);

  const userPermission: any = permissions.find(
    (each: any) => each.module === Modules.user,
  );

  const onClickCard = async (id: number) => {
    userPermission.viewPermission && navigation.navigate('userDetails', id);
  };

  const onEdit = async (id: number) => {
    await dispatch(initialData(id));
    navigation.navigate('addUser', id);
  };

  const onDelete = async (id: number) => {
    const result = await dispatch(deleteUser(id));
    ToastAndroid.show(result.payload.message, ToastAndroid.SHORT);
  };

  const onFABPress = async () => {
    await dispatch(initialData(0));
    navigation.navigate('addUser');
  };

  const onClickSearchButton = async () => {
    Keyboard.dismiss();
    await dispatch(getAllUsers(searchInput));
  };

  const styles = StyleSheet.create({
    wrapper: {
      height: '100%',
    },
    container: {
      height: '100%',
      padding: 15,
      display: 'flex',
      flexDirection: 'column',
    },
    usersCard: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    emptyCard: {
      height: Dimensions.get('screen').height - 200,
      width: '100%',
    },
  });

  return (
    <View style={styles.wrapper}>
      {userState.users.length > 0 ? (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {userState.users.map((item: any) => {
            return (
              <UserCard
                key={item.userId}
                departmentName={item.departmentName}
                roleName={item.roleName}
                firstName={item.firstName}
                lastName={item.lastName}
                isActive={item.isActive}
                id={item.userId}
                onClickCard={onClickCard}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.emptyCard}>
            <NoDataCard />
          </View>
        </ScrollView>
      )}
      {userPermission.addPermission && <AddIconFAB onPress={onFABPress} />}
    </View>
  );
};

export default Users;
