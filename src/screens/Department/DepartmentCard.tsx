/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {Theme} from '../../theme/Theme';
import {useState} from 'react';
import {Avatar} from 'react-native-paper';
import DialogCard from '../../components/dialogCard/dialogCard';
import ToggleSwitch from '../../components/switch/ToggleSwitch';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getDepartment,
  updateDepartment,
} from '../../features/Redux/thunks/DepartmentThunk';
import {useAppTheme} from '../../../App';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';
interface props {
  name: string;
  id: number;
  onEdit: (id: number) => void;
  isSwitchOn: boolean;
}

const DepartmentCard = (props: props) => {
  const {name, id, onEdit, isSwitchOn} = props;
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const dispatch = useAppDispatch();

  const {
    colors: {onSurfaceVariant, background},
  } = useAppTheme();

  const permissions = useAppSelector(state => state.profile.permissions);
  const departmentPermissions: any = permissions.find(
    (each: any) => each.module === Modules.department,
  );

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

  const onClickConfirm = async (id: number, state: boolean) => {
    let updateDepartrtmentData = {
      id: id,
      depDetails: {
        isActive: !state,
      },
    };
    await dispatch(updateDepartment(updateDepartrtmentData))
      .then(async res => {
        if (
          res.meta.requestStatus === 'fulfilled' &&
          res.payload.resultCode === 200
        ) {
          dispatch(getDepartment());
          hideDialog();
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View
      key={id}
      style={[styles.departmentContainer, {backgroundColor: background}]}>
      <View style={styles.departmentName}>
        <Avatar.Text size={28} label={avatarLetter.toUpperCase()} />
        <Text
          style={[styles.text, {color: onSurfaceVariant}]}
          variant="titleMedium">
          {newName}
        </Text>
      </View>
      {departmentPermissions.editPermission && (
        <View style={styles.row}>
          <ToggleSwitch
            onPress={() => setIsDialogVisible(true)}
            status={isSwitchOn}
          />
          <IconButton
            iconColor={onSurfaceVariant}
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
  departmentContainer: {
    backgroundColor: Theme.PRIMARY,
    marginTop: 10,
    marginHorizontal: 5,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  departmentName: {
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
export default DepartmentCard;
