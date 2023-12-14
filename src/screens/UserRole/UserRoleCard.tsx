import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Theme} from '../../theme/Theme';
import {IconButton, Text} from 'react-native-paper';
import DialogCard from '../../components/dialogCard/dialogCard';
import {useAppTheme} from '../../../App';
import {useAppSelector} from '../../features/Redux/Store';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';

interface props {
  id: number;
  name: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClickCard: (id: number) => void;
}

const UserRoleCard = (props: props): JSX.Element => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const {id, name, onEdit, onDelete, onClickCard} = props;

  const {colors} = useAppTheme();

  const permissions = useAppSelector(state => state.profile.permissions);

  const userRolePermission: any = permissions.find(
    (each: any) => each.module === Modules.userRole,
  );

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  const onConfirm = (id: number) => {
    onDelete(id);
    hideDialog();
  };

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.outline,
          borderWidth: 1,
        },
      ]}
      onPress={() => onClickCard(id)}>
      <View style={styles.name}>
        {/* <Avatar.Text size={28} label={avatarLetter.toUpperCase()} /> */}
        <Text style={styles.text} variant="titleMedium">
          {name}
        </Text>
      </View>
      <View style={styles.row}>
        {userRolePermission.editPermission && (
          <IconButton
            iconColor={colors.onSurfaceVariant}
            icon="pencil"
            onPress={() => onEdit(id)}
          />
        )}
        {userRolePermission.deletePermission && (
          <IconButton
            icon="trash-can-outline"
            iconColor={Theme.CANCEL_PRIMARY}
            onPress={() => setIsDialogVisible(true)}
          />
        )}
      </View>
      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onConfirm(id)}
      />
    </Pressable>
  );
};

export default UserRoleCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  name: {
    width: '70%',
    alignSelf: 'center',
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: '3%',
  },
});
