/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, Menu} from 'react-native-paper';
import {Theme} from '../../theme/Theme';

interface sortingProps {
  alphabetAscending?: () => void;
  alphabetDescending?: () => void;
  //   dateAscending?: () => void;
  //   dateDescending?: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  visible: boolean;
  activeMenu?: string;
}

const ClaimStatusSortingMenu = (props: sortingProps): JSX.Element => {
  const {
    alphabetAscending,
    alphabetDescending,
    // dateAscending,
    // dateDescending,
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
      {/* <Menu.Item
        leadingIcon="sort-calendar-ascending"
        onPress={dateAscending}
        title="date"
      />
      <Menu.Item
        leadingIcon="sort-calendar-descending"
        onPress={dateDescending}
        title="date"
      /> */}
    </Menu>
  );
};

export default ClaimStatusSortingMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: Theme.PRIMARY,
  },
});
