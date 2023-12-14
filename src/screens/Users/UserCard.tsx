import React, {useState} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import DialogCard from '../../components/dialogCard/dialogCard';
import {useAppTheme} from '../../../App';
import {useAppSelector} from '../../features/Redux/Store';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';

interface props {
  departmentName: string;
  roleName: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  id: number;
  onClickCard: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
const UserCard = (props: props): JSX.Element => {
  const permissions = useAppSelector(state => state.profile.permissions);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('screen'));

  Dimensions.addEventListener('change', () =>
    setDimensions(Dimensions.get('screen')),
  );

  const userPermission: any = permissions.find(
    (each: any) => each.module === Modules.user,
  );
  const {
    colors: {onSurfaceVariant, outline, background},
  } = useAppTheme();

  const {
    departmentName,
    roleName,
    firstName,
    lastName,
    isActive,
    id,
    onClickCard,
    onEdit,
    onDelete,
  } = props;

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
          borderColor: outline,
          width: `${dimensions.height < dimensions.width ? '48%' : '99%'}`,
          margin: '1%',
        },
      ]}
      onPress={() => onClickCard(id)}>
      <View style={styles.contentCard}>
        <Text style={styles.heading}>{`${firstName} ${lastName || ''}`}</Text>
        <Text style={styles.text}>Department: {departmentName}</Text>
        <Text style={styles.text}>Role: {roleName}</Text>
      </View>
      <View style={styles.buttonCard}>
        {userPermission.deletePermission && (
          <IconButton
            icon="trash-can-outline"
            iconColor="#eb5160"
            onPress={() => {
              setIsDialogVisible(true);
            }}
          />
        )}
        {userPermission.editPermission && (
          <IconButton
            iconColor={onSurfaceVariant}
            icon="pencil"
            onPress={() => {
              onEdit(id);
            }}
          />
        )}
      </View>
      <View
        style={[
          styles.circle,
          {backgroundColor: `${isActive ? '#2cf243' : 'red'}`},
        ]}
      />
      <DialogCard
        message={`Are you sure you want to set to ${
          isActive ? 'Inactive' : 'Active'
        }?`}
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onConfirm(id)}
      />
    </Pressable>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: '3%',
    padding: '4%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  contentCard: {
    flexDirection: 'column',
    width: '70%',
  },
  buttonCard: {
    flexDirection: 'row-reverse',
    width: '30%',
  },
  heading: {
    marginBottom: '3%',
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  text: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  circle: {
    position: 'absolute',
    height: 10,
    width: 10,
    borderRadius: 5,
    top: 10,
    right: 10,
  },
});
