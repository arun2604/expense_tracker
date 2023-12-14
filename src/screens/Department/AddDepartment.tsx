/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { View, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenLoader from '../../components/loader/screenLoader';
import {
  addDepartment,
  updateDepartment,
} from '../../features/Redux/thunks/DepartmentThunk';
import { Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { validationMessages } from '../../utilities/Validations';
import { useAppTheme } from '../../../App';

interface Department {
  id?: number;
  depDetails: {
    departmentName: string;
    companyId?: number | undefined;
  };
}

const AddDepartment = ({ route }: any) => {
  const departmentState: any = useAppSelector(state => {
    return state.department;
  });
  const {
    colors: { surface, onTertiary },
  } = useAppTheme();
  const departmentSchema = yup.object().shape({
    departmentName: yup.string().trim().required(validationMessages.required),
  });
  const [snackbarMsg, setSnackbarMsg] = useState('');
  let id = route.params ? route.params : null;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  const initialData = {
    departmentName: id > 0 ? departmentState.department.name : '',
  };
  const handleCancel = () => {
    navigation.navigate('department');
  };

  return (
    <View style={Styles.departmentContainer}>
      <Formik
        initialValues={initialData}
        validationSchema={departmentSchema}
        enableReinitialize
        onSubmit={async values => {
          let res: any;
          try {
            if (id === null && values.departmentName.length > 0) {
              let departmentdata: Department = {
                depDetails: values,
              };
              res = await dispatch(addDepartment(departmentdata.depDetails));
              if (res.payload.status) {
                navigation.navigate(
                  'department',
                  JSON.stringify(departmentdata),
                );
              } else if (res.payload.message) {
                setSnackbarMsg(res.payload.message);
                onToggleSnackBar();
              }
            } else if (id > 0 && values.departmentName !== null) {
              let departmentdata: Department = {
                id: id,
                depDetails: values,
              };
              res = await dispatch(updateDepartment(departmentdata));
              if (res.payload.status) {
                navigation.navigate(
                  'department',
                  JSON.stringify(departmentdata),
                );
              } else if (res.payload.message) {
                setSnackbarMsg(res.payload.message);
                onToggleSnackBar();
              }
            }
          } catch (error) {
            console.log(error);
            if (res.payload.message) {
              setSnackbarMsg(res.payload.message);
              onToggleSnackBar();
            }
          }
        }}>
        {({
          handleSubmit,
          handleBlur,
          handleChange,
          errors,
          values,
          touched,
        }) => (
          <View style={[Styles.formContainer, { backgroundColor: surface }]}>
            <Input
              handleChange={handleChange('departmentName')}
              title="Name"
              placeholder="ex : IT"
              keyboard="default"
              value={values.departmentName}
              handleBlur={handleBlur('departmentName')}
              helperVisible={
                touched.departmentName && errors.departmentName ? true : false
              }
              helperErrorMessage={errors.departmentName}
            />
            <View style={Styles.buttonContainer}>
              <CancelButton onPress={() => handleCancel()} />
              <SubmitButton onPress={handleSubmit} />
            </View>
          </View>
        )}
      </Formik>
      {departmentState.isLoading && id > 0 && (
        <ScreenLoader visible={departmentState.isLoading} />
      )}
      <Snackbar
        visible={visibleSnackbar}
        duration={2500}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Cancel',
        }}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

export default AddDepartment;

const Styles = StyleSheet.create({
  departmentContainer: {
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
});
