/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import ScreenLoader from '../../components/loader/screenLoader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  addPermission,
  getPermission,
  updatePermission,
} from '../../features/Redux/thunks/PermissionThunk';
import { Snackbar } from 'react-native-paper';
import * as Yup from 'yup';
import { useAppTheme } from '../../../App';
import { validationMessages } from '../../utilities/Validations';
import { Formik } from 'formik';

const AddPermission = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  let id = route.params ? route.params : null;
  const { colors } = useAppTheme();

  const [permissionsName, setPermissionName] = useState('');

  const permissionData: any = useAppSelector(
    state => state.permission.permission,
  );

  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);
  const isLoading = useAppSelector(state => state.permission.isLoading);

  const handlePermissionName = (name: string) => {
    setPermissionName(name);
  };

  useFocusEffect(
    useCallback(() => {
      if (id > 0) {
        setPermissionName(permissionData.name);
      }
    }, [permissionData.name]),
  );

  let permissionName = id > 0 ? permissionData.name : '';

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(validationMessages.required),
  });

  const handleSubmit = async (values: { name: string }) => {
    if (id === null) {
      let permissionBody = {
        permissionName: values.name,
      };
      dispatch(addPermission(permissionBody))
        .then(data => data.payload.status && navigation.navigate('permissions'))
        .catch(error => {
          console.log(error);
        });
    } else {
      await dispatch(getPermission(id));
      let updateBody = {
        id: id,
        updateData: {
          permissionName: values.name,
        },
      };
      await dispatch(updatePermission(updateBody))
        .then(data => {
          if (data.payload.status) {
            navigation.navigate('permissions');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleCancel = () => {
    setPermissionName('');
    navigation.goBack();
  };

  return (
    <View
      style={[
        Styles.permissionContainer,
        { backgroundColor: colors.onTertiary },
      ]}>
      <Formik
        initialValues={{ name: permissionName }}
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
              placeholder="Ex : User_View"
              keyboard="default"
              value={values.name}
              handleBlur={handleBlur('name')}
              helperVisible={touched.name && errors.name ? true : false}
              helperErrorMessage={errors.name}
            />
            <View style={Styles.buttonContainer}>
              <CancelButton onPress={() => handleCancel()} />
              <SubmitButton onPress={() => handleSubmit()} />
            </View>
          </View>
        )}
      </Formik>
      {isLoading && id > 0 && <ScreenLoader visible={isLoading} />}
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

export default AddPermission;

const Styles = StyleSheet.create({
  permissionContainer: {
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
    marginLeft: 'auto',
  },
  colors: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    marginHorizontal: '2%',
    elevation: 6,
  },
  colorContainer: {
    flexDirection: 'row',
    marginTop: '4%',
    marginBottom: '2%',
  },
});
