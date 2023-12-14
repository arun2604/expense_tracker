/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getDepartment,
  getDepartmentById,
} from '../../features/Redux/thunks/DepartmentThunk';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import ScreenLoader from '../../components/loader/screenLoader';
import DepartmentCard from './DepartmentCard';
import {getCompanies} from '../../features/Redux/thunks/CompanyThunks';
import {
  ascending,
  descending,
} from '../../features/Redux/slices/DepartmentSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AddIconFAB from '../../components/FAB/addIconFAB';
import DepartmentSortingMenu from './DepartmentSortingMenu';
import {Text} from 'react-native-paper';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';

const Department = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [visible, setVisible] = useState(false);
  const [activeSortingMenu, setActiveSortingMenu] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  const permissions = useAppSelector(state => state.profile.permissions);

  const departmentPermissions: any = permissions.find(
    (each: any) => each.module === Modules.department,
  );
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getDepartment());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getDepartment());
      dispatch(getCompanies());
    }, []),
  );

  const departmentData = useAppSelector(state => state.department);

  const onEdit = (id: number) => {
    dispatch(getDepartmentById(id))
      .then(
        data =>
          data.meta.requestStatus === 'fulfilled' &&
          navigation.navigate('addDepartment', id),
      )
      .catch(err => console.log(err));
  };

  const onFABPress = () => {
    navigation.navigate('addDepartment');
  };
  const alphabetAscending = () => {
    dispatch(ascending());
    setActiveSortingMenu('alphabetAscending');
    setVisible(false);
  };

  const alphabetDescending = () => {
    dispatch(descending());
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
        <View style={style.sorting}>
          <DepartmentSortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
            activeMenu={activeSortingMenu}
          />
        </View>
        {departmentData.departments ? (
          departmentData.departments.map((item: any) => {
            return (
              <DepartmentCard
                key={item.departmentId}
                id={item.departmentId}
                name={item.name}
                onEdit={onEdit}
                isSwitchOn={item.isActive == 1}
              />
            );
          })
        ) : (
          <Text>No Department data available</Text>
        )}
      </ScrollView>
      {departmentData.isLoading && (
        <ScreenLoader visible={departmentData.isLoading} />
      )}
      {departmentPermissions.addPermission && (
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

export default Department;
