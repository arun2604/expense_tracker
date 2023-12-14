/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, Menu} from 'react-native-paper';
import {Theme} from '../../theme/Theme';

interface sortingProps {
  dateAscending: () => void;
  dateDescending: () => void;
  reqAmountAscending: () => void;
  reqAmountDescending: () => void;
  apprAmountAscending: () => void;
  apprAmountDescending: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  visible: boolean;
  activeMenu?: string;
}

const ClaimSortingMenu = (props: sortingProps): JSX.Element => {
  const {
    dateAscending,
    dateDescending,
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
        leadingIcon="sort-calendar-ascending"
        trailingIcon={activeMenu === 'dateAscending' ? 'check' : ''}
        onPress={dateAscending}
        title="Claim Date"
      />
      <Menu.Item
        leadingIcon="sort-calendar-descending"
        trailingIcon={activeMenu === 'dateDescending' ? 'check' : ''}
        onPress={dateDescending}
        title="Claim Date"
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
    </Menu>
  );
};

export default ClaimSortingMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: Theme.PRIMARY,
  },
});
