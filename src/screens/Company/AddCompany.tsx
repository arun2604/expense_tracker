import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Chip, Snackbar, Text } from 'react-native-paper';
import {
  createCompany,
  updateCompany,
} from '../../features/Redux/thunks/CompanyThunks';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { validations, validationMessages } from '../../utilities/Validations';
import { useAppTheme } from '../../../App';

const AddCompany = ({ route }: any): JSX.Element => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const refRBSheet: any = useRef(null);
  const dispatch = useAppDispatch();

  const id = route.params;

  const companySchema = Yup.object().shape({
    companyName: Yup.string().trim().required(validationMessages.required),
    mobileNumber: Yup.string()
      .matches(validations.phoneRegExp, validationMessages.mobileNoInValid)
      .required(validationMessages.required)
      .max(10, validationMessages.mobileNoMax),
    isEmailRequired: Yup.boolean(),
    email: Yup.string().when([], {
      is: () => id > 0,
      then: schema => schema.notRequired(),
      otherwise: schema =>
        schema
          .required(validationMessages.required)
          .matches(validations.emailRegExp, validationMessages.emailInValid),
    }),
    city: Yup.string().trim().required(validationMessages.required),
    landmark: Yup.string().trim().required(validationMessages.required),
    zipCode: Yup.string()
      .required(validationMessages.required)
      .min(6, 'Enter a valid Zip code')
      .max(6, 'Enter a valid Zip code'),
  });

  const company: any = useAppSelector(state => state.company.company);

  let initialFormData = {
    companyName: id > 0 ? company.companyData.name : '',
    mobileNumber: id > 0 ? company.companyData.mobileNumber : '',
    email: id > 0 ? company.companyData.email : '',
    city: id > 0 ? company.companyData.city : '',
    landmark: id > 0 ? company.companyData.landmark : '',
    zipCode: id > 0 ? company.companyData.zipCode : '',
    isEmailRequired: id > 0 ? false : true,
  };

  const {
    colors: { surface, onTertiary },
  } = useAppTheme();
  const [filteredStates, setFilteredStates] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>({});
  const [countryError, setCountryError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [selectedState, setSelectedState] = useState<any>({});
  const [stateError, setStateError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [bottomSheetType, setBottomSheetType] = useState('');
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (id > 0) {
      let selectedCountryData = company.countries.filter(
        (item: any) => item.countryId === company.companyData.countryId,
      );
      let selectedStateData = company.states.filter(
        (item: any) => item.stateId === company.companyData.stateId,
      );
      setSelectedCountry(selectedCountryData[0]);
      setSelectedState(selectedStateData[0]);
      filterState(selectedCountryData[0]);
    }
  }, []);

  const filterState = (country: any) => {
    let states = [...company.states];
    states = states.filter((item: any) => item.countryId === country.countryId);
    setFilteredStates(states);
  };

  const onCountryPress = () => {
    setBottomSheetType('country');
    setCountryError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    refRBSheet.current.open();
  };

  const onStatePress = () => {
    setBottomSheetType('state');
    setStateError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    refRBSheet.current.open();
  };

  const handleCountriesChips = (item: any) => {
    setSelectedCountry(item);
    let states = [...company.states];
    states = states.filter((state: any) => state.countryId === item.countryId);
    setFilteredStates(states);
    refRBSheet.current.close();
  };

  const handleStateChips = (item: any) => {
    setSelectedState(item);
    refRBSheet.current.close();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const handleCompanySubmit = async (submit: () => void) => {
    if (selectedCountry.countryId === undefined) {
      setCountryError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    if (selectedState.stateId === undefined) {
      setStateError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    submit();
  };

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialFormData}
        onSubmit={async (values: any) => {
          let res: any;
          if (
            selectedCountry.countryId !== undefined &&
            selectedState.stateId !== undefined
          ) {
            if (id > 0) {
              let param = {
                ...values,
                stateId: selectedState.stateId,
                countryId: selectedCountry.countryId,
                id: id,
              };
              res = await dispatch(updateCompany(param));
              if (res.payload === 'Updated successfully') {
                navigation.navigate('company', JSON.stringify(param));
              } else if (res.payload.message) {
                setSnackbarMsg(res.payload.message);
                onToggleSnackBar();
              }
            } else {
              let param = {
                ...values,
                stateId: selectedState.stateId,
                countryId: selectedCountry.countryId,
              };
              res = await dispatch(createCompany(param));
              if (res.payload.resultCode === 201) {
                navigation.navigate('company', JSON.stringify(param));
              } else if (res.payload.message) {
                setSnackbarMsg(res.payload.message);
                onToggleSnackBar();
              }
            }
          }
        }}
        validationSchema={companySchema}
        enableReinitialize>
        {({
          handleSubmit,
          handleBlur,
          handleChange,
          errors,
          values,
          touched,
        }) => (
          <ScrollView contentContainerStyle={[styles.formWrapper]}>
            <View style={[styles.formContainer, { backgroundColor: surface }]}>
              <Input
                handleChange={handleChange('companyName')}
                title="Company Name"
                placeholder="Enter Company Name"
                keyboard="default"
                value={values.companyName}
                handleBlur={handleBlur('companyName')}
                helperVisible={
                  touched.companyName && errors.companyName ? true : false
                }
                helperErrorMessage={errors.companyName}
              />
              <Input
                handleChange={handleChange('mobileNumber')}
                title="Phone Number"
                placeholder="Enter Phone Number"
                keyboard="numeric"
                value={values.mobileNumber}
                handleBlur={handleBlur('mobileNumber')}
                helperVisible={
                  touched.mobileNumber && errors.mobileNumber ? true : false
                }
                helperErrorMessage={errors.mobileNumber}
              />
              {!id && (
                <Input
                  handleChange={handleChange('email')}
                  title="Email"
                  placeholder="Enter Email"
                  keyboard="default"
                  value={values.email}
                  handleBlur={handleBlur('email')}
                  helperVisible={touched.email && errors.email ? true : false}
                  helperErrorMessage={errors.email}
                />
              )}
              <Pressable onPress={onCountryPress}>
                <Input
                  title="Country"
                  placeholder="Select Country"
                  value={selectedCountry.name}
                  editable={false}
                  helperVisible={
                    countryError.touched &&
                      countryError.errorMessage &&
                      (selectedCountry.countryId < 1 ||
                        selectedCountry.countryId === undefined)
                      ? true
                      : false
                  }
                  helperErrorMessage={countryError.errorMessage}
                />
              </Pressable>
              <Pressable onPress={onStatePress}>
                <Input
                  title="State"
                  placeholder="Select State"
                  value={selectedState.name}
                  editable={false}
                  helperVisible={
                    stateError.touched &&
                      stateError.errorMessage &&
                      (selectedState.stateId < 1 ||
                        selectedState.countryId === undefined)
                      ? true
                      : false
                  }
                  helperErrorMessage={stateError.errorMessage}
                />
              </Pressable>
              <Input
                handleChange={handleChange('city')}
                title="City"
                placeholder="Enter city name"
                keyboard="default"
                value={values.city}
                handleBlur={handleBlur('city')}
                helperVisible={touched.city && errors.city ? true : false}
                helperErrorMessage={errors.city}
              />
              <Input
                handleChange={handleChange('landmark')}
                title="Landmark"
                placeholder="Enter Landmark"
                keyboard="default"
                value={values.landmark}
                handleBlur={handleBlur('landmark')}
                helperVisible={
                  touched.landmark && errors.landmark ? true : false
                }
                helperErrorMessage={errors.landmark}
              />
              <Input
                handleChange={handleChange('zipCode')}
                title="Zipcode"
                placeholder="Enter Zipcode"
                keyboard="numeric"
                value={values.zipCode}
                handleBlur={handleBlur('zipCode')}
                helperVisible={touched.zipCode && errors.zipCode ? true : false}
                helperErrorMessage={errors.zipCode}
              />
              <View style={styles.buttonContainer}>
                <CancelButton onPress={() => onCancel()} />
                <SubmitButton
                  onPress={() => handleCompanySubmit(handleSubmit)}
                />
              </View>
            </View>
          </ScrollView>
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
        {bottomSheetType === 'country' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {company.countries.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleCountriesChips(item)}
                  style={{ margin: '3%' }}
                  selected={selectedCountry.countryId === item.countryId}
                  showSelectedOverlay
                  key={item.name}>
                  {item.name}
                </Chip>
              );
            })}
          </ScrollView>
        )}
        {bottomSheetType === 'state' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {selectedCountry.countryId > 0 ? (
              filteredStates.map((item: any) => {
                return (
                  <Chip
                    onPress={() => handleStateChips(item)}
                    style={{ margin: '3%' }}
                    selected={selectedState.stateId === item.stateId}
                    showSelectedOverlay
                    key={item.name}>
                    {item.name}
                  </Chip>
                );
              })
            ) : (
              <Text>Select a country to view states</Text>
            )}
          </ScrollView>
        )}
      </RBSheet>
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

export default AddCompany;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
  },
  formWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});
