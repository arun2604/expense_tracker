/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  createUserRole,
  updateUserRole,
} from '../../features/Redux/thunks/UserRoleThunks';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Chip, Button as PaperButton, Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppTheme } from '../../../App';
import { validationMessages } from '../../utilities/Validations';
import { getProfile } from '../../features/Redux/thunks/ProfileThunk';

const AddUserRole = ({ route }: any): JSX.Element => {
  const userRoleState: any = useAppSelector(state => state.userRole);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const refRBSheet: any = useRef(null);
  const { colors } = useAppTheme();

  const id = route.params ? route.params : null;
  let userRoleName =
    id > 0 ? userRoleState.userRole.data.userRoleData.name : '';

  const [permissionError, setPermissionError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(validationMessages.required),
  });

  const [roleName, setRoleName] = useState(
    id ? userRoleState.userRole.data.userRoleData.name : '',
  );
  const selectedPermissionsData =
    id > 0
      ? userRoleState.userRole.data.userRoleData.selectedPermissions.map(
        (item: any) => {
          return {
            name: item.name,
            id: item.permissionId,
            isDeleted: false,
          };
        },
      )
      : [];
  const [selectedPermissions, setSelectedPermissions] = useState<any>(
    selectedPermissionsData,
  );
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const permissions = useAppSelector(
    state => state.userRole.userRole.data.permissions,
  );

  const handleChange = (name: string) => {
    setRoleName(name);
  };

  const handleChipSelect = (permission: any) => {
    let newArr: any;
    if (id) {
      newArr = [...selectedPermissions];
      let permissionObject = {
        name: permission.name,
        id: permission.permissionId,
        isDeleted: false,
      };
      newArr.push(permissionObject);
      setSelectedPermissions(newArr);
    } else {
      newArr = [...selectedPermissions];
      let permissionObject = {
        name: permission.name,
        id: permission.permissionId,
        isDeleted: false,
      };
      newArr.push(permissionObject);
      setSelectedPermissions(newArr);
    }
  };

  const onRemoveChip = (permission: any) => {
    let newSelectedPermission = [...selectedPermissions];
    let newobj = {};
    newSelectedPermission.map(item => {
      if (item.id) {
        if (item.name === permission.name) {
          newobj = { ...item, isDeleted: true };
          newSelectedPermission.splice(newSelectedPermission.indexOf(item), 1);
          newSelectedPermission = [...newSelectedPermission, newobj];
        }
      } else {
        let newData = newSelectedPermission.filter(
          data => data.name !== permission.name,
        );
        newSelectedPermission = newData;
      }
    });
    setSelectedPermissions(newSelectedPermission);
  };

  const closeBottomSheet = () => {
    refRBSheet.current.close();
  };

  const submit = (handleSubmit: any) => {
    if (
      selectedPermissions.filter((item: any) => item.isDeleted === false)
        .length < 1
    ) {
      setPermissionError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    handleSubmit();
  };

  const handleSubmit = async (values: { name: string }) => {
    if (
      selectedPermissions.filter((item: any) => item.isDeleted === false)
        .length > 0
    ) {
      if (id > 0) {
        let newSelectedpermissions: any = [];
        selectedPermissions.map((item: any) => {
          if (item.createdBy && item.isDeleted) {
            newSelectedpermissions.push({
              id: item.permissionId ? item.permissionId : item.id,
              name: item.name,
              isDeleted: item.isDeleted,
            });
          } else if (!item.createdBy) {
            newSelectedpermissions.push({
              id: item.permissionId ? item.permissionId : item.id,
              name: item.name,
              isDeleted: item.isDeleted,
            });
          }
        });
        let params = {
          id: id,
          updateData: {
            userRoleName: values.name,
            permissions: newSelectedpermissions,
          },
        };
        dispatch(updateUserRole(params))
          .then(res => {
            if (res.payload.status) {
              dispatch(getProfile());
              navigation.navigate('userRole', roleName);
            }
            else if (res.payload.message) {
              setSnackbarMsg(res.payload.message);
              onToggleSnackBar();
            }
          })
          .catch(error => console.log(error));
      } else {
        let params = {
          userRoleName: values.name,
          permissions: selectedPermissions,
        };
        dispatch(createUserRole(params))
          .then(res => {
            if (res.payload.status) {
              navigation.navigate('userRole', roleName);
            } else if (res.payload.message) {
              setSnackbarMsg(res.payload.message);
              onToggleSnackBar();
            }
          })
          .catch(error => console.log(error));
      }
    }
  };

  const handleCancel = () => {
    setRoleName('');
    navigation.goBack();
  };

  const onPermissionPress = () => {
    setPermissionError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    refRBSheet.current.open();
  };

  return (
    <View style={[Styles.container, { backgroundColor: colors.onTertiary }]}>
      <Formik
        initialValues={{ name: userRoleName }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View
            style={[Styles.formContainer, { backgroundColor: colors.surface }]}>
            <Input
              handleChange={handleChange('name')}
              title="Name"
              placeholder="Ex : Admin"
              keyboard="default"
              value={values.name}
              handleBlur={handleBlur('name')}
              helperVisible={touched.name && errors.name ? true : false}
              helperErrorMessage={errors.name}
            />
            <Pressable onPress={onPermissionPress}>
              <Input
                title="Permissions"
                placeholder="Select Permissions"
                value={
                  selectedPermissions.length > 0
                    ? selectedPermissions
                      .filter((item: any) => item.isDeleted !== true)
                      .map(
                        (item: any) => item.isDeleted !== true && item.name,
                      )
                      .join()
                    : ''
                }
                editable={false}
                helperVisible={
                  permissionError.touched &&
                    permissionError.errorMessage &&
                    selectedPermissions.filter(
                      (item: any) => item.isDeleted === false,
                    ).length < 1
                    ? true
                    : false
                }
                helperErrorMessage={permissionError.errorMessage}
              />
            </Pressable>
            <View style={Styles.buttonContainer}>
              <CancelButton onPress={() => handleCancel()} />
              <SubmitButton onPress={() => submit(handleSubmit)} />
            </View>
          </View>
        )}
      </Formik>
      <RBSheet
        ref={refRBSheet}
        height={400}
        closeOnDragDown={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          },
        }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            padding: '5%',
          }}>
          {permissions.length > 0 &&
            permissions.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleChipSelect(item)}
                  style={{ margin: '3%' }}
                  selected={selectedPermissions.some(
                    (permission: any) =>
                      permission.name === item.name &&
                      permission.isDeleted !== true,
                  )}
                  showSelectedOverlay
                  onClose={() => onRemoveChip(item)}
                  closeIcon={
                    selectedPermissions.some(
                      (permission: any) =>
                        permission.name === item.name &&
                        permission.isDeleted !== true,
                    )
                      ? 'close-circle'
                      : 'circle-small'
                  }
                  key={item.name}>
                  {item.name}
                </Chip>
              );
            })}
        </ScrollView>
        <View style={Styles.okButtonContainer}>
          <PaperButton mode="contained" onPress={closeBottomSheet}>
            Ok
          </PaperButton>
        </View>
      </RBSheet>
      <Snackbar
        visible={visibleSnackbar}
        duration={2500}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Cancel',
        }}>
        Hey there! I'm a Snackbar.
      </Snackbar>
    </View>
  );
};

export default AddUserRole;

const Styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.ON_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    padding: 10,
    backgroundColor: Theme.PRIMARY,
    elevation: 10,
    borderRadius: 10,
    width: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  okButtonContainer: {
    margin: 10,
    marginLeft: 'auto',
    width: '25%',
    alignItems: 'center',
  },
});
