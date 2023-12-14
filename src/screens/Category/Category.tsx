/* eslint-disable prettier/prettier */
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import CategoryCard from './CategoryCard';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getCategories,
  getCategory,
} from '../../features/Redux/thunks/CategoryThunks';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenLoader from '../../components/loader/screenLoader';
import AddIconFAB from '../../components/FAB/addIconFAB';
// import {
//   ascendingCategory,
//   descendingCategory,
// } from '../../features/Redux/slices/CategorySlice';
// import CategorySortingMenu from './CategorySortingMenu';
import {useAppTheme} from '../../../App';
import {Text} from 'react-native-paper';
import {RefreshControl} from 'react-native-gesture-handler';
import Modules from '../../utilities/Modules';

const Category = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {colors} = useAppTheme();

  const categoryState = useAppSelector(state => state.category);
  const permissions = useAppSelector(state => state.profile.permissions);
  // const [visible, setVisible] = useState(false);
  // const [activeSortingMenu, setActiveSortingMenu] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getCategories());
    setRefreshing(false);
  };

  const categoryPermission: any = permissions.find(
    (each: any) => each.module === Modules.category,
  );

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const onEdit = async (id: number) => {
    await dispatch(getCategory(id));
    navigation.navigate('addCategory', id);
  };

  const onFABPress = () => {
    navigation.navigate('addCategory');
  };

  // const alphabetAscending = () => {
  //   dispatch(ascendingCategory());
  //   setActiveSortingMenu('alphabetAscending');
  //   setVisible(false);
  // };

  // const alphabetDescending = () => {
  //   dispatch(descendingCategory());
  //   setActiveSortingMenu('alphabetDescending');
  //   setVisible(false);
  // };
  return (
    <View>
      <ScrollView
        style={[styles.wrapper, {backgroundColor: colors.background}]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={styles.sorting}>
          <CategorySortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
            activeMenu={activeSortingMenu}
          />
        </View> */}
        {categoryState.categories.length > 0 ? (
          categoryState.categories.map((item: any) => {
            return (
              <CategoryCard
                key={item.categoryId}
                id={item.categoryId}
                name={item.name}
                onEdit={onEdit}
                isSwitchOn={item.isActive == 1}
              />
            );
          })
        ) : (
          <Text>No Category data available</Text>
        )}
      </ScrollView>
      {categoryState.isLoading && (
        <ScreenLoader visible={categoryState.isLoading} />
      )}
      {categoryPermission.addPermission && <AddIconFAB onPress={onFABPress} />}
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    padding: 10,
  },
  sorting: {
    marginLeft: 'auto',
  },
});
