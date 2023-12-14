/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {View, StyleSheet} from 'react-native';
import {Text, IconButton} from 'react-native-paper';
import {useState} from 'react';
import {Avatar} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {
  getCategories,
  updateCategory,
} from '../../features/Redux/thunks/CategoryThunks';
import DialogCard from '../../components/dialogCard/dialogCard';
import ToggleSwitch from '../../components/switch/ToggleSwitch';
import {useAppTheme} from '../../../App';
import Modules from '../../utilities/Modules';

interface props {
  name: string;
  id: number;
  onEdit: (id: number) => void;
  isSwitchOn: boolean;
}

const CategoryCard = (props: props) => {
  const {name, id, onEdit, isSwitchOn} = props;
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(state => state.profile.permissions);

  const categoryPermission: any = permissions.find(
    (each: any) => each.module === Modules.category,
  );

  const {colors} = useAppTheme();

  let splitName = name.split(' ');
  let avatarLetter = '';
  const length = name.length;
  let newName = '';
  splitName.map(item => {
    avatarLetter += item.slice(0, 1);
    newName += item.slice(0, 1).toUpperCase() + item.slice(1, length) + ' ';
  });

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  // const [isActive, setIsActive] = useState(isSwitchOn);

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  const onClickConfirm = (id: number) => {
    let param = {
      id: id,
      updateData: {
        isActive: !isSwitchOn,
      },
    };
    dispatch(updateCategory(param))
      .then(async res => {
        if (res.payload.status) {
          await dispatch(getCategories());
          // console.log('isActive', isActive);
          // setIsActive(!isActive);
          hideDialog();
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View
      key={id}
      style={[
        styles.categoryContainer,
        {backgroundColor: colors.background, borderColor: colors.outline},
      ]}>
      <View style={styles.categoryName}>
        <Avatar.Text size={28} label={avatarLetter.toUpperCase()} />
        <Text
          style={[styles.text, {color: colors.onSurfaceVariant}]}
          variant="titleMedium">
          {newName}
        </Text>
      </View>
      {categoryPermission.editPermission && (
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
        onConfirm={() => onClickConfirm(id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
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
  categoryName: {
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
export default CategoryCard;
