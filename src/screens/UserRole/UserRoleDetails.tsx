import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView, View, StyleSheet, RefreshControl} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Theme} from '../../theme/Theme';
import {DeleteButton, EditButton} from '../../components/button/Button';
import {
  getUserRoleDetails,
  deleteUserRole,
  getUserRoles,
  getInitialData,
} from '../../features/Redux/thunks/UserRoleThunks';
import {deleteUser, initialData} from '../../features/Redux/thunks/UserThunks';
import DialogCard from '../../components/dialogCard/dialogCard';
import UserCard from '../Users/UserCard';
import {useAppTheme} from '../../../App';
import {Text} from 'react-native-paper';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';

const UserRoleDetails = ({route}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userRoleDetailsState: any = useAppSelector(
    state => state.userRole.userRoleDetails,
  );
  const permissionsList: any = useAppSelector(
    state => state.profile.permissions,
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getUserRoleDetails(id));
    setRefreshing(false);
  };

  const userRolePermission: any = permissionsList.find(
    (each: any) => each.module === Modules.userRole,
  );
  const userPermission: any = permissionsList.find(
    (each: any) => each.module === Modules.user,
  );

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  // const [showSnackbar, setShowSnackbar] = useState(false);

  let id = route.params;
  const {colors} = useAppTheme();

  useEffect(() => {
    dispatch(getUserRoleDetails(id));

    return () => {
      id = null;
    };
  }, [id]);

  const {userRole, users, permissions} = userRoleDetailsState;

  const onPressEdit = async () => {
    await dispatch(getInitialData(id));
    navigation.navigate('addUserRole', id);
  };

  const onPressDelete = async () => {
    setIsDialogVisible(true);
  };

  const onConfirmDelete = async () => {
    await dispatch(deleteUserRole(id));
    setIsDialogVisible(false);
    await dispatch(getUserRoles());
    navigation.navigate('userRole', id);
  };

  const onClickCard = async (id: number) => {
    userPermission.viewPermission && navigation.navigate('userDetails', id);
  };

  const onEditUser = async (id: number) => {
    await dispatch(initialData(id));
    navigation.navigate('addUser', id);
  };

  const onDeleteUser = async (id: number) => {
    await dispatch(deleteUser(id));
    await dispatch(getUserRoleDetails(id));
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={[
            styles.card,
            {backgroundColor: colors.surface, borderColor: colors.outline},
          ]}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: colors.onSurfaceVariant}]}>
              {userRole.name}
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={[styles.subtitle, {color: colors.onSurfaceVariant}]}>
              Permissions :
            </Text>
            {permissions.map((eachPermission: object) => {
              let {permissionId, name}: any = eachPermission;
              name = name.replace('PERMISSION_', '').replace(/_/g, ' ');
              return (
                <Text
                  style={[styles.text, {color: colors.onSurfaceVariant}]}
                  key={permissionId}>
                  {name}
                </Text>
              );
            })}
          </View>
        </View>
        {userPermission.listPermission && users.length > 0 && (
          <>
            <View
              style={[
                styles.card,
                {
                  justifyContent: 'center',
                  marginBottom: 10,
                  padding: 10,
                  borderColor: colors.outline,
                },
              ]}>
              <Text
                style={[
                  styles.title,
                  {marginBottom: 0, color: colors.onSurfaceVariant},
                ]}>
                Users
              </Text>
            </View>
            <View style={styles.body}>
              {users.map((item: any) => {
                return (
                  <UserCard
                    key={item.userId}
                    departmentName={item.departmentName}
                    roleName={item.roleName}
                    firstName={item.firstName}
                    lastName={item.lastName}
                    isActive={item.isActive}
                    id={item.userId}
                    onClickCard={() => onClickCard(item.userId)}
                    onEdit={() => onEditUser(item.userId)}
                    onDelete={() => onDeleteUser(item.userId)}
                  />
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {userRolePermission.editPermission && (
          <EditButton onPress={() => onPressEdit()} />
        )}
        {userRolePermission.deletePermission && (
          <DeleteButton onPress={() => onPressDelete()} />
        )}
      </View>
      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default UserRoleDetails;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  dialog: {
    backgroundColor: Theme.PRIMARY,
  },
  btn: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'blue',
  },
  listItem: {
    marginVertical: 3,
  },
  listItemName: {
    color: Theme.SECONDARY,
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
