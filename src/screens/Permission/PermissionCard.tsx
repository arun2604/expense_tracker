/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Theme } from '../../theme/Theme';
import { useState } from 'react';
import { Avatar } from 'react-native-paper';
import DialogCard from '../../components/dialogCard/dialogCard';
import ToggleSwitch from '../../components/switch/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  getPermissions,
  updatePermission,
} from '../../features/Redux/thunks/PermissionThunk';
import { useAppTheme } from '../../../App';
import Modules from '../../utilities/Modules';

interface props {
  name: string;
  id: number;
  onEdit: (id: number) => void;
  isSwitchOn: boolean;
}

const PermissionCard = (props: props) => {
  const { name, id, onEdit, isSwitchOn } = props;
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();

  const permissions = useAppSelector(state => state.profile.permissions);
  const permissionList: any = permissions.find(
    (each: any) => each.module === Modules.permission,
  );

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  const onClickConfirm = async (id: number, state: boolean) => {
    let updatePermissionData = {
      id: id,
      updateData: {
        isActive: !state,
      },
    };
    await dispatch(updatePermission(updatePermissionData))
      .then(async res => {
        if (res.payload.status) {
          await dispatch(getPermissions());
          hideDialog();
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View
      key={id}
      style={[
        styles.permissionContainer,
        { backgroundColor: colors.background, borderColor: colors.outline, marginBottom: 10 },
      ]}>
      <View style={styles.PermissionName}>
        <Avatar.Text size={28} label={name[0].toUpperCase()} />
        <Text
          style={[styles.text, { color: colors.onSurfaceVariant }]}
          variant="titleMedium">
          {name}
        </Text>
      </View>
      {permissionList.editPermission && (
        <View style={styles.row}>
          <ToggleSwitch
            onPress={() => setIsDialogVisible(true)}
            status={isSwitchOn}
          />
          <IconButton
            iconColor={colors.onSurfaceVariant}
            icon="pencil"
            onPress={() => onEdit(id)}
          />
        </View>
      )}
      <DialogCard
        message={`Are you sure you want to set to Inactive?`}
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onClickConfirm(id, isSwitchOn)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  PermissionName: {
    width: '70%',
    alignSelf: 'center',
    margin: 5,
    flexDirection: 'row',
  },
  text: {
    color: Theme.SECONDARY,
    marginLeft: '3%',
  },
});
export default PermissionCard;
