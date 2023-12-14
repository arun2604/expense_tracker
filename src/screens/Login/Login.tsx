/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, Snackbar } from 'react-native-paper';
import Input from '../../components/Input';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import {
  sendLoginData,
  verifyOTP,
} from '../../features/Redux/thunks/LoginThunks';
import ScreenLoader from '../../components/loader/screenLoader';
import { Theme } from '../../theme/Theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as yup from 'yup';
// import {emailRegExp} from '../../utilities/Validations';
import { useAppTheme } from '../../../App';
import { getDashboardDetails } from '../../features/Redux/thunks/DashboardThunks';
import { getProfile } from '../../features/Redux/thunks/ProfileThunk';

const Login = () => {
  const requiremsg = '* Require';
  const loginScheme = yup.object().shape({
    username: yup.string().required(requiremsg),
    password: yup
      .string()
      .required(requiremsg)
      .min(8, 'Minimum 8 number required'),
  });

  const initialLoginValues = {
    username: '',
    password: '',
  };
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const RBSheetRef: any = useRef(null);
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();

  const dimensions = Dimensions.get('screen');
  const [isportrait, setIsPortrait] = useState(
    dimensions.height > dimensions.width,
  );

  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [count, setCount] = useState(0);
  const [resend, setResend] = useState(true);
  const otpInputRefs: any = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { isLoading } = useAppSelector(state => state.login);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count === 0) {
        clearInterval(interval);
      } else {
        setCount(count - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [resend, count]);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  const handleOTPChange = (text: string, index: number) => {
    if (text.length === 1 && index < 5) {
      otpInputRefs[index + 1].current.focus();
    }

    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);
  };

  const handleOTPDelete = (index: number) => {
    if (otp[index] === '') {
      otpInputRefs[index - 1].current.focus();
    }
  };

  const updateIsPortait = () => {
    setIsPortrait(!isportrait);
  };

  Dimensions.addEventListener('change', updateIsPortait);

  const handleLoginSubmit = async () => {
    try {
      if (userName !== '' && password !== '') {
        let res = await dispatch(
          sendLoginData({ username: userName, password: password }),
        );
        if (res.payload.data !== null && res.payload.resultCode === 200) {
          navigation.reset({ index: 0, routes: [{ name: 'DrawerNavigation' }] });
        } else if (
          res.payload.data === null &&
          res.payload.resultCode === 200
        ) {
          setCount(40);
          RBSheetRef.current.open();
          setResend(!resend);
        } else {
          if (res.payload.message) {
            setSnackbarMsg(res.payload.message);
            onToggleSnackBar();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpSubmit = async () => {
    let fullOTP = otp.join('');
    let params = {
      email: userName,
      otp: fullOTP,
      event: 'verify email',
    };
    dispatch(verifyOTP(params))
      .then(res => {
        console.log('res::', res.payload.data);
        if (res.payload.data.status) {
          dispatch(getProfile()).then(async (res: any) => {
            if (res.payload.status && res.payload.data.userId > 0) {
              const dashboardDetails = await dispatch(getDashboardDetails());
              if (dashboardDetails.payload.status) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'DrawerNavigation' }],
                });
              }
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          });
        } else {
          setShowSnackbar(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleResendOtp = async () => {
    await handleLoginSubmit();
    setCount(40);
    setResend(!resend);
  };

  return (
    <View style={[style.wrapper, { backgroundColor: colors.inverseOnSurface }]}>
      <Formik
        initialValues={initialLoginValues}
        onSubmit={async values => {
          setUserName(values.username);
          setPassword(values.password);
          try {
            if (values.username !== '' && values.password !== '') {
              let res = await dispatch(
                sendLoginData({
                  username: values.username,
                  password: values.password,
                }),
              );
              setSnackbarMsg(res.payload.message);
              onToggleSnackBar();
              if (res.payload.status && res.payload.data !== null) {
                const dashboardDetails = await dispatch(getDashboardDetails());
                if (dashboardDetails.payload.status) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerNavigation' }],
                  });
                }
              }
              if (res.payload.status === true && res.payload.data === null) {
                setCount(40);
                RBSheetRef.current.open();
                setResend(!resend);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }}
        validationSchema={loginScheme}
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
            contentContainerStyle={style.loginWrapper}
            keyboardShouldPersistTaps="handled">
            <View
              style={
                isportrait
                  ? [
                    style.loginContainer,
                    { backgroundColor: colors.primaryContainer },
                  ]
                  : [
                    style.loginContainerLandscape,
                    { backgroundColor: colors.primaryContainer },
                  ]
              }>
              <Text variant="headlineMedium" style={style.loginText}>
                Login
              </Text>
              <Input
                handleChange={handleChange('username')}
                title="Username"
                placeholder="Enter email"
                keyboard="default"
                value={values.username}
                handleBlur={handleBlur('username')}
                helperVisible={
                  touched.username && errors.username ? true : false
                }
                helperErrorMessage={errors.username}
              />
              <Input
                handleChange={handleChange('password')}
                title="Password"
                placeholder="Enter Password"
                // keyboard="numeric"
                viewPassword={checked ? false : true}
                value={values.password}
                isPassword={true}
                checked={checked}
                handleBlur={handleBlur('password')}
                helperVisible={
                  touched.password && errors.password ? true : false
                }
                helperErrorMessage={errors.password}
                setChecked={setChecked}
              />
              <View style={style.buttonContainer}>
                <SubmitButton title={'Login'} onPress={handleSubmit} />
              </View>
              <Text
                style={style.forgotText}
                onPress={() => navigation.navigate('ForgetPassword')}>
                Forgot Password?
              </Text>
            </View>
          </ScrollView>
        )}
      </Formik>
      {/* {isLoading && <ScreenLoader visible={isLoading} />} */}
      <RBSheet
        ref={RBSheetRef}
        height={400}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        <View>
          <View style={style.otpTextContainer}>
            <Text style={style.optText1}>Enter the Verification Code </Text>
            <Text style={style.optText2}>Email Sent to {userName}</Text>
          </View>
          <View style={style.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpInputRefs[index]}
                style={style.input}
                onChangeText={text => handleOTPChange(text, index)}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') {
                    handleOTPDelete(index);
                  }
                }}
              />
            ))}
          </View>
        </View>
        <SubmitButton title={'Login'} onPress={() => handleOtpSubmit()} />
        <View style={style.resendContainer}>
          {count === 0 ? (
            <Pressable onPress={handleResendOtp}>
              <Text style={style.activeTimer}>Resend OTP </Text>
            </Pressable>
          ) : (
            <Text style={style.inActiveTimer}>Resend OTP in : 00.{count}</Text>
          )}
        </View>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          elevation={2}>
          <Text style={style.snackbarText}>Invalid OTP please try again</Text>
        </Snackbar>
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

const style = StyleSheet.create({
  wrapper: {
    height: '100%',
  },
  loginWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: '8%',
  },
  title: {
    color: Theme.PRIMARY,
    fontSize: 31,
    fontWeight: 'bold',
  },
  loginContainer: {
    width: '90%',
    elevation: 10,
    borderRadius: 10,
    padding: '5%',
  },
  loginContainerLandscape: {
    elevation: 10,
    width: '60%',
    borderRadius: 10,
    margin: '5%',
    padding: '5%',
  },
  loginText: {
    alignSelf: 'center',
  },
  forgotText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: Theme.ON_PRIMARY,
    marginTop: 5,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-2%',
    marginBottom: '5%',
  },
  otpTextContainer: {
    justifyContent: 'center',
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    margin: 5,
    textAlign: 'left',
    fontSize: 18,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  buttonContainerLandscape: {
    top: '5%',
    backgroundColor: Theme.ON_PRIMARY,
    width: '50%',
    height: '17%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1.2),
    left: '23%',
  },
  button: {
    color: Theme.PRIMARY,
    fontSize: 16,
  },
  activeTimer: {
    color: Theme.SECONDARY,
    fontWeight: '600',
  },
  inActiveTimer: {
    color: '#878787',
  },
  resendContainer: {
    top: '5%',
  },
  optText1: {
    fontSize: 20,
    fontWeight: '600',
    color: Theme.SECONDARY,
    textAlign: 'center',
  },
  optText2: {
    fontSize: 15,
    padding: '5%',
    color: Theme.SECONDARY,
    textAlign: 'center',
  },
  snackbarText: {
    textAlign: 'center',
    color: Theme.PRIMARY,
  },
});

export default Login;
