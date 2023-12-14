import React, {useRef, useState} from 'react';
import {View, StyleSheet, ToastAndroid, Keyboard} from 'react-native';
import {Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {validations, validationMessages} from '../../utilities/Validations';
import Input from '../../components/Input';
import {SubmitButton} from '../../components/button/Button';
import {useAppDispatch} from '../../features/Redux/Store';
import {
  changePassword,
  forgetPassword,
} from '../../features/Redux/thunks/LoginThunks';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppTheme} from '../../../App';

const ForgetPassword = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const refRBSheet: any = useRef(null);
  const [emailInputValue, setEmailInputValue] = useState('');

  const {colors} = useAppTheme();

  const forgetPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(validations.emailRegExp, validationMessages.emailInValid)
      .required('Please enter a registered email'),
  });

  const changePasswordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(/^[0-9]+$/, 'Password should be numbers only')
      .required(validationMessages.required)
      .min(8, 'Password must be at least 8 characters'),
    otp: Yup.string()
      .matches(/^[0-9]+$/, 'OTP should be numbers only')
      .required(validationMessages.required)
      .min(6, 'OTP should have 6 digits')
      .max(6, 'OTP should have 6 digits'),
  });

  const onClickSendOtp = async (
    values: {email: string},
    action: FormikHelpers<{email: string}>,
  ) => {
    Keyboard.dismiss();
    setEmailInputValue(values.email);
    const result = await dispatch(forgetPassword({email: values.email}));
    ToastAndroid.show(result.payload.message, ToastAndroid.SHORT);
    if (result.payload.status) {
      refRBSheet.current.open();
    }
  };

  const onClickSubmit = async (
    values: {password: string; otp: string},
    action: FormikHelpers<{password: string; otp: string}>,
  ) => {
    Keyboard.dismiss();
    const result = await dispatch(
      changePassword({
        email: emailInputValue,
        password: values.password,
        otp: values.otp,
      }),
    );
    ToastAndroid.show(result.payload.message, ToastAndroid.SHORT);
    if (result.payload.status) {
      navigation.navigate('Login');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: colors.inverseOnSurface,
    },
    formCard: {
      padding: 20,
      borderRadius: 10,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: colors.tertiaryContainer,
    },
    buttonContainer: {
      alignItems: 'center',
    },
    bottomSheetCard: {
      backgroundColor: colors.inverseOnSurface,
      justifyContent: 'center',
      padding: 20,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{email: ''}}
        onSubmit={(values, action) => onClickSendOtp(values, action)}
        validationSchema={forgetPasswordValidationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formCard}>
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
            <View style={styles.buttonContainer}>
              <SubmitButton title="Send OTP" onPress={() => handleSubmit()} />
            </View>
          </View>
        )}
      </Formik>
      <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={250}
        customStyles={{
          container: styles.bottomSheetCard,
        }}>
        <Formik
          initialValues={{password: '', otp: ''}}
          onSubmit={(values, action) => onClickSubmit(values, action)}
          validationSchema={changePasswordValidationSchema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formCard}>
              <Input
                handleChange={handleChange('password')}
                title="Password"
                placeholder="Enter New Password"
                keyboard="numeric"
                value={values.password}
                handleBlur={handleBlur('password')}
                helperVisible={
                  touched.password && errors.password ? true : false
                }
                helperErrorMessage={errors.password}
              />
              <Input
                handleChange={handleChange('otp')}
                title="OTP"
                placeholder="Enter OTP"
                keyboard="numeric"
                value={values.otp}
                handleBlur={handleBlur('otp')}
                helperVisible={touched.otp && errors.otp ? true : false}
                helperErrorMessage={errors.otp}
              />
              <View style={styles.buttonContainer}>
                <SubmitButton onPress={() => handleSubmit()} />
              </View>
            </View>
          )}
        </Formik>
      </RBSheet>
    </View>
  );
};

export default ForgetPassword;
