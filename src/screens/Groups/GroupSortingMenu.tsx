/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, Menu} from 'react-native-paper';
import {Theme} from '../../theme/Theme';

interface sortingProps {
  alphabetAscending?: () => void;
  alphabetDescending?: () => void;
  startDateAscending?: () => void;
  startDateDescending?: () => void;
  endDateAscending: () => void;
  endDateDescending: () => void;
  reqAmountAscending: () => void;
  reqAmountDescending: () => void;
  apprAmountAscending: () => void;
  apprAmountDescending: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  visible: boolean;
  activeMenu?: string;
}

const GroupSortingMenu = (props: sortingProps): JSX.Element => {
  const {
    alphabetAscending,
    alphabetDescending,
    startDateAscending,
    startDateDescending,
    endDateAscending,
    endDateDescending,
    reqAmountAscending,
    reqAmountDescending,
    apprAmountAscending,
    apprAmountDescending,
    visible,
    openMenu,
    closeMenu,
    activeMenu,
  } = props;

  return (
    <Menu
      visible={visible}
      contentStyle={styles.menuContainer}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="sort"
          size={25}
          onPress={openMenu}
          style={{marginVertical: 0}}
        />
      }>
      <Menu.Item
        leadingIcon="sort-alphabetical-ascending"
        trailingIcon={activeMenu === 'alphabetAscending' ? 'check' : ''}
        onPress={alphabetAscending}
        title="name"
      />
      <Menu.Item
        leadingIcon="sort-alphabetical-descending"
        trailingIcon={activeMenu === 'alphabetDescending' ? 'check' : ''}
        onPress={alphabetDescending}
        title="name"
      />
      <Menu.Item
        leadingIcon="cash-fast"
        trailingIcon={activeMenu === 'reqAmountAscending' ? 'check' : ''}
        onPress={reqAmountAscending}
        title="Req. Amount(high to low)"
      />
      <Menu.Item
        leadingIcon="cash-fast"
        trailingIcon={activeMenu === 'reqAmountDescending' ? 'check' : ''}
        onPress={reqAmountDescending}
        title="Req. Amount(low to high)"
      />
      <Menu.Item
        leadingIcon="cash-check"
        trailingIcon={activeMenu === 'apprAmountAscending' ? 'check' : ''}
        onPress={apprAmountAscending}
        title="Appr. Amount(high to low)"
      />
      <Menu.Item
        leadingIcon="cash-check"
        trailingIcon={activeMenu === 'apprAmountDescending' ? 'check' : ''}
        onPress={apprAmountDescending}
        title="Appr. Amount(low to high)"
      />
      <Menu.Item
        leadingIcon="sort-calendar-ascending"
        trailingIcon={activeMenu === 'startDateAscending' ? 'check' : ''}
        onPress={startDateAscending}
        title="start date"
      />
      <Menu.Item
        leadingIcon="sort-calendar-descending"
        trailingIcon={activeMenu === 'startDateDescending' ? 'check' : ''}
        onPress={startDateDescending}
        title="start date"
      />
      <Menu.Item
        leadingIcon="sort-calendar-ascending"
        trailingIcon={activeMenu === 'endDateAscending' ? 'check' : ''}
        onPress={endDateAscending}
        title="end date"
      />
      <Menu.Item
        leadingIcon="sort-calendar-descending"
        trailingIcon={activeMenu === 'endDateDescending' ? 'check' : ''}
        onPress={endDateDescending}
        title="end date"
      />
    </Menu>
  );
};

export default GroupSortingMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: Theme.PRIMARY,
  },
});
