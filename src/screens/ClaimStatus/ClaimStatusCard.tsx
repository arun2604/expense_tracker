/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {useState} from 'react';
import {Avatar} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import DialogCard from '../../components/dialogCard/dialogCard';
import ToggleSwitch from '../../components/switch/ToggleSwitch';
import {useAppTheme} from '../../../App';
import Modules from '../../utilities/Modules';
import {
  getClaimGroupStatus,
  updateClaimGroupStatus,
} from '../../features/Redux/thunks/ClaimGroupStatusThunk';

interface props {
  name: string;
  id: number;
  onEdit: (id: number) => void;
  isSwitchOn: boolean;
}

const ClaimStatusCard = (props: props) => {
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(state => state.profile.permissions);

  const {colors} = useAppTheme();
  const {name, id, onEdit, isSwitchOn} = props;
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const claimStatusPermissions: any = permissions.find(
    (each: any) => each.module === Modules.claimStatus,
  );

  // const hasDeleteUserPermission = permissions.some(
  //   (eachItem: any) => eachItem.name === Permissions.deleteClaimStatus,
  // );

  let splitName = name.split(' ');
  let avatarLetter = '';
  const length = name.length;
  let newName = '';
  splitName.map(item => {
    avatarLetter += item.slice(0, 1);
    newName += item.slice(0, 1).toUpperCase() + item.slice(1, length) + ' ';
  });

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  const onClickConfirm = () => {
    let param = {
      id: id,
      updateData: {
        isActive: !isSwitchOn,
      },
    };
    dispatch(updateClaimGroupStatus(param)).then(async res => {
      if (res.meta.requestStatus === 'fulfilled') {
        await dispatch(getClaimGroupStatus());
        hideDialog();
      }
    });
  };

  return (
    <View
      key={id}
      style={[
        styles.claimStatusContainer,
        {backgroundColor: colors.background, borderColor: colors.outline},
      ]}>
      <View style={styles.claimStatusName}>
        <Avatar.Text size={28} label={avatarLetter.toUpperCase()} />
        <Text
          style={[styles.text, {color: colors.onSurfaceVariant}]}
          variant="titleMedium">
          {newName}
        </Text>
      </View>
      {claimStatusPermissions.editPermission && (
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
        message={`Are you sure you want to set to ${
          isSwitchOn ? 'Inactive' : 'Active'
        }?`}
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onClickConfirm()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  claimStatusContainer: {
    marginTop: 10,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  claimStatusName: {
    width: '70%',
    alignSelf: 'center',
    margin: 5,
    flexDirection: 'row',
  },
  text: {
    marginLeft: '3%',
  },
});
export default ClaimStatusCard;
