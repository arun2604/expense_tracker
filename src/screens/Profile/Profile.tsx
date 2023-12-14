/* eslint-disable prettier/prettier */
import {View, ScrollView, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Theme} from '../../theme/Theme';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppDispatch, useAppSelector} from '../../features/Redux/Store';
import {getProfile} from '../../features/Redux/thunks/ProfileThunk';
import {Avatar, Divider, List, Text} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DialogCard from '../../components/dialogCard/dialogCard';
import ToggleSwitch from '../../components/switch/ToggleSwitch';
import {setIsDarkTheme} from '../../features/Redux/slices/themeslice';
import {useAppTheme} from '../../../App';
import {RefreshControl} from 'react-native-gesture-handler';

const Profile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const ProfileData: any = useAppSelector(state => state.profile.profile);
  const isDarkTheme: any = useAppSelector(state => state.theme.isDarkTheme);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getProfile());
    setRefreshing(false);
  };

  const {
    colors: {outline},
  } = useAppTheme();

  const changeTheme = async () => {
    await AsyncStorage.setItem('isDarkTheme', JSON.stringify(!isDarkTheme));
    dispatch(setIsDarkTheme());
  };

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const hideDialog = () => {
    setShowLogoutDialog(false);
  };

  const onLogout = () => {
    AsyncStorage.clear();
    setShowLogoutDialog(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[styles.profilePhoto, {borderColor: outline}]}>
          <View style={styles.avatar}>
            <Avatar.Icon size={wp(15)} icon="account" />
            <View style={styles.txtContainer}>
              <Text variant="headlineMedium" style={styles.text}>
                {`${ProfileData.firstName} ${
                  ProfileData.lastName ? ProfileData.lastName : ''
                }`}
              </Text>
              <Text style={styles.text}>{ProfileData.email}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.container, {borderColor: outline}]}>
          {/* <View style={styles.item}>
              <List.Item
                title={ProfileData.email}
                left={props => <List.Icon {...props} icon="at" />}
              />
            </View> */}
          <View style={styles.item}>
            <List.Item
              title={
                ProfileData.mobileNumber ? ProfileData.mobileNumber : 'N/A'
              }
              left={props => <List.Icon {...props} icon="phone" />}
            />
          </View>
          <View style={styles.item}>
            <List.Item
              title={ProfileData.companyName}
              left={props => <List.Icon {...props} icon="office-building" />}
            />
          </View>
          <View style={styles.item}>
            <List.Item
              title={ProfileData.departmentName}
              left={props => <List.Icon {...props} icon="account-box" />}
            />
          </View>
          <View style={styles.item}>
            <List.Item
              title={ProfileData.roleName}
              left={props => <List.Icon {...props} icon="briefcase" />}
            />
          </View>
        </View>
        <Pressable
          onPress={() => setShowLogoutDialog(true)}
          style={[styles.logoutBase, {borderColor: outline}]}>
          <List.Item
            title="Logout"
            right={props => <List.Icon {...props} icon="logout" />}
            style={styles.item}
          />
        </Pressable>
        <Pressable style={[styles.themeCard, {borderColor: outline}]}>
          <Text style={styles.themeText}>Dark Theme</Text>
          <ToggleSwitch onPress={changeTheme} status={isDarkTheme} />
        </Pressable>
      </ScrollView>
      <DialogCard
        message="Are you sure you want to Logout?"
        isDialogVisible={showLogoutDialog}
        setIsDialogVisible={setShowLogoutDialog}
        onConfirm={() => onLogout()}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    padding: 15,
  },
  container: {
    // backgroundColor: '#fff',
    marginBottom: 15,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  item: {
    padding: 0,
  },
  logoutBase: {
    marginBottom: 15,
    // backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutTxt: {
    // color: Theme.SECONDARY,
    fontSize: 18,
    fontWeight: '700',
  },
  txtContainer: {
    marginLeft: 5,
  },
  text: {
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '600',
    // color: '#6c6c6c',
    textAlign: 'left',
  },
  profilePhoto: {
    marginBottom: 15,
    paddingVertical: 10,
    // backgroundColor: Theme.PRIMARY,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: Theme.PRIMARY,
    marginBottom: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeText: {
    fontSize: 16,
  },
});
