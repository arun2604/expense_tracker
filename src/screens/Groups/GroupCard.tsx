/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */

import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../../theme/Theme';
import { IconButton, Text, Card, TouchableRipple } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  getClaimsByGroupId,
  getClaimsSubmittedByGroupId,
  getGroup,
  getGroupSubmittedById,
} from '../../features/Redux/thunks/GroupThunks';
import DialogCard from '../../components/dialogCard/dialogCard';
import { useAppTheme } from '../../../App';
import Permissions from '../../utilities/Permissions';
import Modules from '../../utilities/Modules';
import { getClaimById } from '../../features/Redux/thunks/ClaimThunk';

interface groupProps {
  name: string;
  dateRange: string;
  requestedAmount: number;
  approvedAmount: number;
  description: string;
  id: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  status: string;
  claimStatusId: number;
  username: string;
  roleName: string;
}

const GroupCard = (props: groupProps) => {
  const {
    name,
    dateRange,
    requestedAmount,
    approvedAmount,
    description,
    id,
    onEdit,
    onDelete,
    status,
    claimStatusId,
    username,
    roleName,
  } = props;

  const dispatch = useAppDispatch();
  const permissions = useAppSelector(state => state.profile.permissions);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {
    colors: { onSurfaceVariant, outline, background, elevation },
  } = useAppTheme();

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const groupPermission: any = permissions.find(
    (each: any) => each.module === Modules.group,
  );

  const onClickConfirm = (id: number) => {
    onDelete(id);
    setIsDialogVisible(false);
  };

  const onGroupClick = async (id: number) => {
    if (groupPermission.viewPermission) {
      groupPermission.changeGroupStatusPermission ?
        await dispatch(getClaimsByGroupId(id))
        : await dispatch(getClaimsByGroupId(id));
      await dispatch(getGroup(id));
      navigation.navigate('groupDetails', { id: id });
    }
  };

  return (
    <>
      <Card
        style={[
          styles.container,
          { backgroundColor: background, borderColor: outline },
        ]}
        elevation={0}>
        <TouchableRipple
          onPress={() => onGroupClick(id)}
          rippleColor={elevation.level2}>
          <View>
            <View style={styles.titleContainer}>
              <Card.Title
                title={name}
                titleStyle={[styles.title, { color: onSurfaceVariant }]}
                right={() => {
                  return (
                    <Text
                      style={[
                        styles.title,
                        { color: onSurfaceVariant, marginRight: 20 },
                      ]}>
                      {status}
                    </Text>
                  );
                }}
              />
            </View>
            <Card.Content>
              <View style={styles.nameContainer}>
                <Text style={{ color: onSurfaceVariant, marginLeft: 'auto' }}>
                  {dateRange}
                </Text>
              </View>
              {groupPermission.changeGroupStatusPermission && (
                <View style={styles.amountContainer}>
                  <Text style={{ color: onSurfaceVariant }}>Username : </Text>
                  <Text style={{ color: onSurfaceVariant }}>{username}</Text>
                </View>
              )}
              <View style={styles.amountContainer}>
                <Text style={{ color: onSurfaceVariant }}>
                  Requested Amount :{' '}
                </Text>
                <Text style={{ color: onSurfaceVariant }}>
                  {requestedAmount ? requestedAmount : 'N/A'}
                </Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={{ color: onSurfaceVariant }}>
                  Approved Amount :{' '}
                </Text>
                <Text style={{ color: onSurfaceVariant }}>
                  {approvedAmount ? approvedAmount : 'N/A'}
                </Text>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={{ color: onSurfaceVariant }}>{description}</Text>
                <View style={styles.buttonContainer}>
                  {groupPermission.editPermission && claimStatusId == 1 && (
                    <IconButton
                      iconColor={onSurfaceVariant}
                      icon="pencil"
                      size={20}
                      onPress={() => onEdit(id)}
                    />
                  )}
                  {groupPermission.deletePermission && claimStatusId == 1 && (
                    <IconButton
                      icon="trash-can-outline"
                      iconColor={Theme.CANCEL_PRIMARY}
                      size={20}
                      onPress={() => setIsDialogVisible(true)}
                    />
                  )}
                </View>
              </View>
            </Card.Content>
          </View>
        </TouchableRipple>
      </Card>
      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onClickConfirm(id)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingBottom: 10,
  },
  title: {
    fontWeight: '700',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: '500',
  },
  amountContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountText: {
    fontWeight: '600',
  },
  amount: {
    fontWeight: '400',
    marginLeft: 'auto',
    marginRight: '5%',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  descriptionText: {},
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default GroupCard;
