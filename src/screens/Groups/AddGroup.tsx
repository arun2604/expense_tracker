import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  addGroup,
  updateGroup,
} from '../../features/Redux/thunks/GroupThunks';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenLoader from '../../components/loader/screenLoader';
import { Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppTheme } from '../../../App';
import { validationMessages } from '../../utilities/Validations';
import { getClaims } from '../../features/Redux/thunks/ClaimThunk';

const AddGroup = ({ route }: any): JSX.Element => {
  const groupSchema = yup.object().shape({
    expenseReportName: yup
      .string()
      .trim()
      .required(validationMessages.required)
      .min(3, 'Group name Must contain more than 3 letters'),
    description: yup.string().trim().required(validationMessages.required).min(6, validationMessages.descriptionMin),
  });

  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { group, isLoading }: any = useAppSelector(state => state.group);
  const { id, selectedExp, selectedExpAllDetails } = route.params ? route.params : 0;

  console.log(id)
  const today = new Date();
  const date = useRef(new Date());

  const {
    colors: { surface, outline },
  } = useAppTheme();

  let initialFormData = {
    expenseReportName: id > 0 ? group.name : '',
    description: id > 0 ? group.description : '',
  };

  let newDate = selectedExpAllDetails && selectedExpAllDetails.length > 0 && selectedExpAllDetails.sort();

  const [dateRange, setDateRange] = useState({
    startDate: id > 0 ? new Date(group.startDate) : newDate && newDate.length > 0
      ? new Date(newDate[0]) : new Date(),
    endDate: id > 0 ? new Date(group.endDate) : newDate && newDate.length > 0
      ? new Date(newDate[newDate.length - 1]) : new Date(),
  });
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date()
  }
  )
  let isFirst = true
  useFocusEffect(
    useCallback(() => {
      if (selectedExpAllDetails) {
        if (isFirst) {
          let newDate = selectedExpAllDetails.sort();
          setDates({
            startDate: new Date(newDate[0]),
            endDate: new Date(newDate[newDate.length - 1]),
          });
          isFirst = false;
        }
      }
    }, [selectedExpAllDetails])
  );
  const [showStartDate, setStartShowDate] = useState(false);
  const [showEndDate, setEndShowDate] = useState(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  //Functions for handling start and end date changes
  const OnStartDateChange = useCallback(
    (event: any, selectedDate: Date | undefined) => {
      if (selectedDate !== undefined) {
        let newDate = selectedDate;
        newDate.setHours(0, 0, 0, 0);
        setDateRange(prev => {
          return {
            ...prev,
            startDate: newDate,
          };
        });
        ToggleStartDatePicker();
      }
    },
    [showStartDate],
  );

  const OnEndDateChange = useCallback(
    (event: any, selectedDate: Date | undefined) => {
      if (selectedDate !== undefined) {
        let newDate = selectedDate;
        newDate.setHours(0, 0, 0, 0);

        setDateRange(prev => {
          return {
            ...prev,
            endDate: newDate,
          };
        });
      }
    },
    [showEndDate],
  );

  const ToggleStartDatePicker = () => {
    setStartShowDate(!showStartDate);
  };

  const ToggleEndDatePicker = () => {
    setEndShowDate(!showEndDate);
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Formik
          initialValues={initialFormData}
          onSubmit={async values => {
            let res: any;
            try {
              let param = {
                ...values,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                selectedExp: selectedExp ? selectedExp : false
              };
              console.log(param)
              if (
                values.expenseReportName !== '' &&
                values.description !== '' &&
                id === undefined || id === 0
              ) {
                res = await dispatch(addGroup(param));
                selectedExp ? navigation.goBack()
                  : navigation.navigate('reports', JSON.stringify(param));
                if (res.payload.status) {
                  if (selectedExp.length > 0) {
                    await dispatch(getClaims());
                  }
                } else if (res.payload.message) {
                  setSnackbarMsg(res.payload.message);
                  onToggleSnackBar();
                }
              } else if (
                values.expenseReportName !== '' &&
                values.description !== '' &&
                id > 0
              ) {
                let updateData = {
                  id: id,
                  groupUpdateData: param,
                };
                res = await dispatch(updateGroup(updateData));
                if (res.payload.status) {
                  navigation.navigate('reports', JSON.stringify(param));
                } else if (res.payload.message) {
                  setSnackbarMsg(res.payload.message);
                  onToggleSnackBar();
                }
              }
            } catch (error) {
              if (res.payload.message) {
                setSnackbarMsg(res.payload.message);
                onToggleSnackBar();
              }
            }
          }}
          validationSchema={groupSchema}
          enableReinitialize>
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            values,
            touched,
          }) => (
            <ScrollView
              contentContainerStyle={[
                styles.formWrapper,
                { backgroundColor: surface, borderColor: outline },
              ]}>
              <Input
                handleChange={handleChange('expenseReportName')}
                title="Name"
                placeholder="Enter Report Name"
                keyboard="default"
                value={values.expenseReportName}
                handleBlur={handleBlur('expenseReportName')}
                helperVisible={
                  touched.expenseReportName && errors.expenseReportName
                    ? true
                    : false
                }
                helperErrorMessage={errors.expenseReportName}
              />
              <Input
                handleChange={handleChange('description')}
                title="Report Description"
                placeholder="Enter Description"
                keyboard="default"
                value={values.description}
                handleBlur={handleBlur('description')}
                helperVisible={
                  touched.description && errors.description ? true : false
                }
                helperErrorMessage={errors.description}
              />
              <View>
                <Pressable onPress={ToggleStartDatePicker}>
                  <Input
                    title={'Start Date'}
                    value={dateRange.startDate.toDateString()}
                    placeholder={'Enter Date'}
                    editable={false}
                  />
                </Pressable>
                {showStartDate && (
                  <DateTimePicker
                    maximumDate={dateRange.endDate}
                    mode="date"
                    display="spinner"
                    value={date.current}
                    onChange={OnStartDateChange}
                  />
                )}
              </View>
              <View>
                <Pressable onPress={ToggleEndDatePicker}>
                  <Input
                    title={'End Date'}
                    value={dateRange.endDate.toDateString()}
                    placeholder={'Enter Date'}
                    editable={false}
                  />
                </Pressable>
                {showEndDate && (
                  <DateTimePicker
                    minimumDate={dateRange.startDate}
                    mode="date"
                    display="spinner"
                    value={date.current}
                    onChange={OnEndDateChange}
                  />
                )}
              </View>
              <View style={styles.buttonContainer}>
                <CancelButton onPress={() => onCancel()} />
                <SubmitButton onPress={() => handleSubmit()} />
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
      {id > 0 && isLoading && <ScreenLoader visible={isLoading} />}
      <Snackbar
        visible={visibleSnackbar}
        duration={2500}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Cancel',
        }}>
        {snackbarMsg}
      </Snackbar>
    </View >
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    width: '90%',
  },
  formWrapper: {
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});
