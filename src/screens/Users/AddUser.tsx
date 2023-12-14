import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  addUser,
  getAllUsers,
  updateUser,
} from '../../features/Redux/thunks/UserThunks';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Chip, Snackbar } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../App';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { validations, validationMessages } from '../../utilities/Validations';

const AddUser = ({ route }: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const refRBSheet: any = useRef(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    colors: { surface, onTertiary },
  } = useAppTheme();

  const id = route.params || '';

  const userSchema = Yup.object().shape({
    firstName: Yup.string().trim().required(validationMessages.required),
    lastName: Yup.string().trim().required(validationMessages.required),
    mobileNumber: Yup.string()
      .required(validationMessages.required)
      .matches(validations.numberRegExp, validationMessages.mobileNoInValid)
      .max(10, validationMessages.mobileNoMax)
      .min(10, validationMessages.mobileNoMin),
    email: Yup.string()
      .required(validationMessages.required)
      .matches(validations.emailRegExp, validationMessages.emailInValid),
    password: Yup.string()
      .when([], {
        is: () => id > 0,
        then: schema => schema.notRequired(),
        otherwise: schema => schema.required(validationMessages.required),
      })
      .matches(validations.numberRegExp, validationMessages.numberInvalid)
      .min(8, 'Should contain atleast 8 digits'),
  });

  const [snackbarMsg, setSnackbarMsg] = useState('');

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const userState: any = useAppSelector(state => state.user);
  let { departments, userRoles, user } = userState.initialData;
  departments = departments ? departments : [];
  userRoles = userRoles ? userRoles : [];
  const genderList = ['Male', 'Female', 'Transgender'];

  let initialFormData = {
    firstName: id > 0 ? user.firstName : '',
    lastName: id > 0 ? user.lastName : '',
    mobileNumber: id > 0 ? user.mobileNumber : '',
    email: id > 0 ? user.email : '',
    password: id > 0 ? user.password : '',
  };

  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>({});
  const [departmentError, setDepartmentError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [selectedUserRole, setSelectedUserRole] = useState<any>({});
  const [userRoleError, setuserRoleError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [selectedGender, setSelectedGender] = useState<any>('');
  const [genderError, setGenderError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [bottomSheetType, setBottomSheetType] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (id > 0) {
        const selectedDepartment = {
          departmentId: user.departmentId,
          name: user.departmentName,
        };
        setSelectedDepartment(selectedDepartment);
        const selectedUserRole = {
          roleId: user.roleId,
          name: user.roleName.toLowerCase(),
        };
        setSelectedUserRole(selectedUserRole);
        const selectedGender = genderList.find(
          (item: any) => item === user.gender,
        );
        setSelectedGender(selectedGender);
      }
    }, []),
  );

  const onCancel = () => {
    navigation.goBack();
  };

  const handleUserSubmit = async (submit: any) => {
    if (selectedDepartment.departmentId === undefined) {
      setDepartmentError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    if (selectedUserRole.roleId === undefined) {
      setuserRoleError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    if (selectedGender === '') {
      setGenderError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    submit();
  };

  const onClickDepartment = () => {
    setDepartmentError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    setBottomSheetType('department');
    refRBSheet.current.open();
  };

  const handleDepartmentChips = (item: any) => {
    setSelectedDepartment(item);
    refRBSheet.current.close();
  };

  const onClickUserRole = () => {
    setuserRoleError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    setBottomSheetType('userRole');
    refRBSheet.current.open();
  };

  const handleUserRoleChips = (item: any) => {
    setSelectedUserRole(item);
    refRBSheet.current.close();
  };

  const onClickGender = () => {
    setGenderError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    setBottomSheetType('gender');
    refRBSheet.current.open();
  };

  const handleGenderChips = (item: any) => {
    setSelectedGender(item);
    refRBSheet.current.close();
  };

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  return (
    <View style={[styles.container]}>
      <View style={[styles.formContainer, { backgroundColor: surface }]}>
        <Formik
          initialValues={initialFormData}
          onSubmit={async values => {
            if (
              selectedDepartment.departmentId !== undefined &&
              selectedUserRole.roleId !== undefined &&
              selectedGender !== ''
            ) {
              let result;
              if (id > 0) {
                let param = {
                  ...values,
                  roleId: selectedUserRole.roleId,
                  departmentId: selectedDepartment.departmentId,
                  gender: selectedGender,
                  id: id,
                };
                let updateFormData = {
                  updateData: { ...param },
                  id: id,
                };
                result = await dispatch(updateUser(updateFormData));
                if (result.payload.message) {
                  setSnackbarMsg(result.payload.message);
                  onToggleSnackBar();
                }
              } else {
                let param = {
                  ...values,
                  roleId: selectedUserRole.roleId,
                  departmentId: selectedDepartment.departmentId,
                  gender: selectedGender,
                };
                result = await dispatch(addUser(param));
                if (result.payload.message) {
                  console.log(result, 2);
                  setSnackbarMsg(result.payload.message);
                  onToggleSnackBar();
                }
              }
              await dispatch(getAllUsers(''));
              if (result.payload.status) {
                navigation.goBack();
              }
            }
          }}
          validationSchema={userSchema}
          enableReinitialize>
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            values,
            touched,
          }) => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <Input
                handleChange={handleChange('firstName')}
                title="First Name"
                placeholder="First Name"
                keyboard="default"
                value={values.firstName}
                handleBlur={handleBlur('firstName')}
                helperVisible={
                  touched.firstName && errors.firstName ? true : false
                }
                helperErrorMessage={errors.firstName}
              />
              <Input
                handleChange={handleChange('lastName')}
                title="Last Name"
                placeholder="Last Name"
                keyboard="default"
                value={values.lastName}
                handleBlur={handleBlur('lastName')}
                helperVisible={
                  touched.lastName && errors.lastName ? true : false
                }
                helperErrorMessage={errors.lastName}
              />
              <Pressable onPress={onClickGender}>
                <Input
                  title="Gender"
                  placeholder="Select Gender"
                  value={selectedGender}
                  editable={false}
                  helperVisible={
                    genderError.touched &&
                      genderError.errorMessage &&
                      selectedGender === ''
                      ? true
                      : false
                  }
                  helperErrorMessage={genderError.errorMessage}
                />
              </Pressable>
              <Input
                handleChange={handleChange('mobileNumber')}
                title="Mobile Number"
                placeholder="Mobile Number"
                keyboard="numeric"
                value={values.mobileNumber}
                handleBlur={handleBlur('mobileNumber')}
                helperVisible={
                  touched.mobileNumber && errors.mobileNumber ? true : false
                }
                helperErrorMessage={errors.mobileNumber}
              />
              <Input
                handleChange={handleChange('email')}
                title="Email"
                placeholder="Email"
                keyboard="default"
                value={values.email}
                handleBlur={handleBlur('email')}
                helperVisible={touched.email && errors.email ? true : false}
                helperErrorMessage={errors.email}
              />
              {id === '' && (
                <Input
                  handleChange={handleChange('password')}
                  title="Password"
                  placeholder="Password"
                  keyboard="numeric"
                  value={values.password}
                  handleBlur={handleBlur('firstName')}
                  helperVisible={
                    touched.password && errors.password ? true : false
                  }
                  helperErrorMessage={errors.password}
                />
              )}
              <Pressable onPress={onClickDepartment}>
                <Input
                  title="Department"
                  placeholder="Select Department"
                  value={selectedDepartment.name}
                  editable={false}
                  helperVisible={
                    departmentError.touched &&
                      departmentError.errorMessage &&
                      (selectedDepartment.departmentId < 1 ||
                        selectedDepartment.departmentId === undefined)
                      ? true
                      : false
                  }
                  helperErrorMessage={departmentError.errorMessage}
                />
              </Pressable>
              <Pressable onPress={onClickUserRole}>
                <Input
                  title="User Role"
                  placeholder="Select User Role"
                  value={selectedUserRole.name}
                  editable={false}
                  helperVisible={
                    userRoleError.touched &&
                      userRoleError.errorMessage &&
                      (selectedUserRole.roleId < 1 ||
                        selectedUserRole.roleId === undefined)
                      ? true
                      : false
                  }
                  helperErrorMessage={userRoleError.errorMessage}
                />
              </Pressable>
              <View style={styles.buttonContainer}>
                <CancelButton onPress={onCancel} />
                <SubmitButton
                  onPress={() => handleUserSubmit(handleSubmit)}
                  disabled={userState.isLoading}
                />
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
      <RBSheet
        ref={refRBSheet}
        height={400}
        closeOnDragDown={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
          },
        }}>
        {bottomSheetType === 'department' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {departments.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleDepartmentChips(item)}
                  style={{ margin: '3%' }}
                  selected={
                    selectedDepartment.departmentId === item.departmentId
                  }
                  showSelectedOverlay
                  key={item.name}>
                  {item.name}
                </Chip>
              );
            })}
          </ScrollView>
        )}
        {bottomSheetType === 'userRole' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {userRoles.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleUserRoleChips(item)}
                  style={{ margin: '3%' }}
                  selected={selectedUserRole.roleId === item.roleId}
                  showSelectedOverlay
                  key={item.roleId}>
                  {item.name}
                </Chip>
              );
            })}
          </ScrollView>
        )}
        {bottomSheetType === 'gender' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {genderList.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleGenderChips(item)}
                  style={{ margin: '3%' }}
                  selected={selectedGender === item}
                  showSelectedOverlay
                  key={item}>
                  {item}
                </Chip>
              );
            })}
          </ScrollView>
        )}
      </RBSheet>
      <Snackbar
        visible={visibleSnackbar}
        duration={2500}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
        }}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    width: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
