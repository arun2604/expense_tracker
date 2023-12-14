/* eslint-disable prettier/prettier */
import {StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTheme} from '../features/Redux/thunks/ThemeThunks';
import {useAppDispatch, useAppSelector} from '../features/Redux/Store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getProfile} from '../features/Redux/thunks/ProfileThunk';
import {getDashboardDetails} from '../features/Redux/thunks/DashboardThunks';

const SplashScreen = () => {
  const dispatch = useAppDispatch();
  const isDarkTheme: any = useAppSelector(state => state.theme.isDarkTheme);

  useEffect(() => {
    dispatch(getTheme());
  }, [isDarkTheme]);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const validateAccessToken = async () => {
    let token = await AsyncStorage.getItem('accessToken');
    console.log(token);
    if (token) {
      dispatch(getProfile()).then(async (res: any) => {
        if (res.payload.status && res.payload.data.userId > 0) {
          const dashboardDetails = await dispatch(getDashboardDetails());
          if (dashboardDetails.payload.status) {
            navigation.reset({
              index: 0,
              routes: [{name: 'DrawerNavigation'}],
            });
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  useEffect(() => {
    validateAccessToken();
  }, []);

  return (
    <View>
      <LottieView
        source={require('../assets/cash_splashscreen.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={style.splashScreen}
      />
    </View>
  );
};

const style = StyleSheet.create({
  splashScreen: {
    height: '100%',
    width: '100%',
  },
});

export default SplashScreen;
