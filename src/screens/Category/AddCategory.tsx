/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  addCategory,
  getCategories,
  updateCategory,
} from '../../features/Redux/thunks/CategoryThunks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenLoader from '../../components/loader/screenLoader';
import { Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAppTheme } from '../../../App';
import { validationMessages } from '../../utilities/Validations';

const AddCategory = ({ route }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useAppTheme();

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  let id = route.params ? route.params : null;

  const categoryState: any = useAppSelector(state => {
    return state.category;
  });

  const initialData = {
    categoryName: id > 0 ? categoryState.category.name : '',
  };

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string()
      .trim()
      .required(validationMessages.required)
      .min(3, 'Name must contain at least 3 characters'),
  });

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={[Styles.categoryContainer]}>
      <Formik
        initialValues={initialData}
        onSubmit={async values => {
          let result: any;
          try {
            if (id === null && values.categoryName.length > 0) {
              result = await dispatch(addCategory(values));
              if (result.payload.status) {
                dispatch(getCategories());
                navigation.goBack();
              } else if (result.payload.message) {
                setSnackbarMsg(result.payload.message);
                onToggleSnackBar();
              }
            } else if (id > 0 && values.categoryName.length > 0) {
              let category: any = {
                id: id,
                updateData: values,
              };
              result = await dispatch(updateCategory(category));
              if (result.payload.status) {
                dispatch(getCategories());
                navigation.goBack();
              } else if (result.payload.message) {
                setSnackbarMsg(result.payload.message);
                onToggleSnackBar();
              }
            }
          } catch (error) {
            console.log(error);
            if (result.payload.message) {
              setSnackbarMsg(result.payload.message);
              onToggleSnackBar();
            }
          }
        }}
        validationSchema={validationSchema}
        enableReinitialize>
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
              handleChange={handleChange('categoryName')}
              title="Name"
              placeholder="Ex : Travel"
              keyboard="default"
              value={values.categoryName}
              handleBlur={handleBlur('categoryName')}
              helperVisible={
                touched.categoryName && errors.categoryName ? true : false
              }
              helperErrorMessage={errors.categoryName}
            />
            <View style={Styles.buttonContainer}>
              <CancelButton onPress={() => handleCancel()} />
              <SubmitButton onPress={handleSubmit} />
            </View>
          </View>
        )}
      </Formik>
      {categoryState.isLoading && id > 0 && (
        <ScreenLoader visible={categoryState.isLoading} />
      )}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={onDismissSnackBar}
        duration={2500}
        action={{
          label: 'Cancel',
        }}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

export default AddCategory;

const Styles = StyleSheet.create({
  categoryContainer: {
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
