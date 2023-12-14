/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../../theme/Theme';
import Input from '../../components/Input';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import ScreenLoader from '../../components/loader/screenLoader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Snackbar } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppTheme } from '../../../App';
import {
  addClaimGroupStatus,
  getClaimGroupStatus,
  getClaimGroupStatusById,
  updateClaimGroupStatus,
} from '../../features/Redux/thunks/ClaimGroupStatusThunk';

const AddClaimStatus = ({ route }: any) => {
  const claiimStatusSchema = yup.object().shape({
    claimGroupStatusName: yup.string().trim().required('* Required'),
  });
  const claimGroupStatus: any = useAppSelector(
    state => state.claimGroupStatus.claimGroupStatusById,
  );
  const {
    colors: { surface, onTertiary },
  } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  let id = route.params ? route.params : null;

  const [color, setColor] = useState<any>();
  const [colorErrorMsg, setColorErrorMsg] = useState<any>();
  const [colorSelected, setColorSelected] = useState(
    id > 0 ? claimGroupStatus.color || '#ff0005' : '#ff0005',
  );
  const colors = ['#ff0005', '#FFA500', '#1b00ff', '#00e302', '#d5f900'];

  const isLoading = useAppSelector(state => state.claimStatus.isLoading);
  const [visibleSnackbar, setVisibleSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  const selectedColor = (colorName: any) => {
    setColorSelected('');
    setColor(colorName);
    setColorSelected(colorName);
  };

  const handleCancel = () => {
    navigation.goBack();
  };
  return (
    <View style={[Styles.categoryContainer]}>
      <Formik
        initialValues={{
          claimGroupStatusName: id > 0 ? claimGroupStatus.name : '',
        }}
        validationSchema={claiimStatusSchema}
        enableReinitialize
        onSubmit={async values => {
          let res: any;
          try {
            if (colorSelected.length === 0) {
              setSnackbarMsg('Please select color');
              onToggleSnackBar();
            }
            if (values.claimGroupStatusName.length >= 3 && colorSelected) {
              if (id === null) {
                let claimStatus = {
                  claimGroupStatusName: values.claimGroupStatusName,
                };
                res = await dispatch(addClaimGroupStatus(claimStatus));
                if (res.payload.status) {
                  await dispatch(getClaimGroupStatus());
                  navigation.pop(1);
                } else if (res.payload.message) {
                  setSnackbarMsg(res.payload.message);
                  onToggleSnackBar();
                }
              } else {
                await dispatch(getClaimGroupStatusById(id));
                let claimStatus = {
                  id: id,
                  updateData: {
                    claimGroupStatusName: values.claimGroupStatusName,
                  },
                };
                res = await dispatch(updateClaimGroupStatus(claimStatus));
                if (res.payload.status) {
                  await dispatch(getClaimGroupStatus());
                  navigation.pop(1);
                }
              }
            } else {
              console.log('enter 3 or more letters');
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
              handleChange={handleChange('claimGroupStatusName')}
              title="Name"
              placeholder="ex : Pending"
              keyboard="default"
              value={values.claimGroupStatusName}
              handleBlur={handleBlur('claimGroupStatusName')}
              helperVisible={
                touched.claimGroupStatusName && errors.claimGroupStatusName
                  ? true
                  : false
              }
              helperErrorMessage={errors.claimGroupStatusName}
            />
            {/* <View style={Styles.colorContainer}>
              {colors.map((item, index) => (
                <Pressable
                  style={[
                    Styles.pressable,
                    {
                      backgroundColor:
                        colorSelected === item ? Theme.SECONDARY : undefined,
                    },
                  ]}
                  key={index}
                  onPress={() => selectedColor(item)}>
                  <View style={[Styles.colors, { backgroundColor: item }]}></View>
                </Pressable>
              ))}
              {touched.claimStatusName && errors.claimStatusName
                ? true
                : false && (
                  <HelperText
                    type="error"
                    visible={
                      touched.claimStatusName && errors.claimStatusName
                        ? true
                        : false
                    }>
                    {colorErrorMsg}
                  </HelperText>
                )}
            </View> */}
            <View style={Styles.buttonContainer}>
              <CancelButton onPress={() => handleCancel()} />
              <SubmitButton onPress={handleSubmit} />
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
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

export default AddClaimStatus;

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
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(6),
    width: wp(6),
    borderRadius: wp(3),
  },
  colors: {
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    marginHorizontal: '6%',
    elevation: 6,
  },
  colorContainer: {
    flexDirection: 'row',
    marginTop: '4%',
    marginBottom: '2%',
  },
});
