/* eslint-disable prettier/prettier */
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  deleteCompany,
  getCompanies,
  getCompany,
} from '../../features/Redux/thunks/CompanyThunks';
import { useNavigation } from '@react-navigation/native';
import CompanyCard from './CompanyCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AddIconFAB from '../../components/FAB/addIconFAB';
import SortingMenu from '../../components/menu/sortingMenu';
import {
  ascendingComapny,
  descendingCompany,
} from '../../features/Redux/slices/CompanySlice';
import CompanySortingMenu from './CompanySortingMenu';
import { Text } from 'react-native-paper';

const Companies = ({ route }: any): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const companyParams = route.params ? route.params : '';

  const companyState = useAppSelector(state => state.company);
  const [visible, setVisible] = useState(false);
  const [activeSortingMenu, setActiveSortingMenu] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(getCompanies());
    }, [companyParams]),
  );

  const onEdit = async (id: number) => {
    await dispatch(getCompany(id));
    navigation.navigate('addCompany', id);
  };

  const onDelete = (id: number) => {
    dispatch(deleteCompany(id));
  };

  const onNavigate = async () => {
    await dispatch(getCompany(null));
    navigation.navigate('addCompany');
  };
  const alphabetAscending = () => {
    dispatch(ascendingComapny());
    setActiveSortingMenu('alphabetAscending');
    setVisible(false);
  };

  const alphabetDescending = () => {
    dispatch(descendingCompany());
    setActiveSortingMenu('alphabetDescending');
    setVisible(false);
  };

  return (
    <View>
      <ScrollView style={styles.wrapper}>
        <View style={styles.sorting}>
          <CompanySortingMenu
            visible={visible}
            openMenu={() => setVisible(true)}
            closeMenu={() => setVisible(false)}
            alphabetAscending={alphabetAscending}
            alphabetDescending={alphabetDescending}
            activeMenu={activeSortingMenu}
          />
        </View>
        {companyState.companies.length > 0 ?
          companyState.companies.map((item: any) => {
            return (
              <CompanyCard
                id={item.companyId}
                name={item.name}
                phoneNo={item.mobileNumber}
                email={item.email}
                landmark={item.landmark}
                city={item.city}
                state={item.stateName}
                zipCode={item.zipCode}
                country={item.countryName}
                key={item.companyId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          }) :
          <Text>No Company data available</Text>}
      </ScrollView>
      <AddIconFAB onPress={onNavigate} />
    </View>
  );
};

export default Companies;

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
