/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from '../../components/Input';
import {
  Text,
  Chip,
  Portal,
  Modal,
  IconButton,
  Snackbar,
  Dialog,
  Button as PaperButton,
} from 'react-native-paper';
import { CancelButton, SubmitButton } from '../../components/button/Button';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../features/Redux/Store';
import {
  addClaim,
  getClaimById,
  getClaimHistoryById,
  getClaims,
  updateClaim,
} from '../../features/Redux/thunks/ClaimThunk';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenLoader from '../../components/loader/screenLoader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { validations, validationMessages } from '../../utilities/Validations';
import { useAppTheme } from '../../../App';
import Modules from '../../utilities/Modules';

const AddClaim = ({ route }: any) => {
  const { categories, expenseReports, expense } = useAppSelector(
    state => state.claimReducer.formData,
  );
  const expenseAttachments = useAppSelector((state) => state.claimReducer.claim)
  const permissions = useAppSelector(state => state.profile.permissions);
  const hasPermission = (permissionName: any) =>
    permissions.some((eachItem: any) => eachItem.name === permissionName);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {
    colors: { surface, onTertiary, outline },
  } = useAppTheme();
  let id = route.params ? route.params : null;

  const expenseState = useAppSelector(
    state => state.claimReducer.claim,
  );
  const isLoading: any = useAppSelector(state => state.claimReducer.isLoading);

  const RBSheetRef: any = useRef(null);
  const date = useRef(new Date());
  const claimValidationSchema = Yup.object().shape({
    description: Yup.string()
      .trim()
      .required(validationMessages.required)
      .min(6, 'Description should be at least 6 characters'),
    expenseAmount: Yup.string()
      .required(validationMessages.required)
      .matches(validations.amountRegExp, 'Amount should contain only numbers'),
  });

  let initialFormData = {
    description: id > 0 ? expense.description : '',
    reference: id > 0 ? expense.reference : '',
    expenseAmount: id > 0 ? expense.expenseAmount : null,
  };

  const [locationData, setLocationData] = useState<any>({
    latitude: null,
    longitude: null,
  });
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const [dateRange, setDateRange] = useState({
    minDate: new Date(),
    maxDate: new Date(),
  });
  const [BSheetitem, setBSheetItem] = useState('');
  const [imageData, setImageData] = useState<any>(
    id ? expenseAttachments.expenseAttachments ? expenseAttachments.expenseAttachments : [] : []
  );
  const [modelImage, setModelImage] = useState<any>();
  const [showDate, setShowDate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [locationDialogVisible, setLocationDialogVisible] = useState(false);
  const [settingsDialogVisible, setSettingsDialogVisible] = useState(false);
  const [categoryError, setCategoryError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });
  const [groupError, setGroupError] = useState({
    errorMessage: '',
    showErrorMessage: false,
    touched: false,
  });

  const requestLocationPermission = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.CAMERA
    ]
    );
    return granted;
  };

  async function checkLocationPermission() {
    try {
      setLocationDialogVisible(false);
      let isGranted = await requestLocationPermission();
      if (isGranted['android.permission.ACCESS_FINE_LOCATION']
        && isGranted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED) {
        getUserLocation();
      } else if (isGranted['android.permission.ACCESS_FINE_LOCATION']
        && isGranted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.DENIED) {
        setLocationDialogVisible(true);
      } else if (isGranted['android.permission.ACCESS_FINE_LOCATION']
        && isGranted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setSettingsDialogVisible(true);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        let currentLatitude = position.coords.latitude;
        let currentLongitude = position.coords.longitude;
        setLocationData((prev: any) => {
          return {
            ...prev,
            ['latitude']: currentLatitude,
            ['longitude']: currentLongitude,
          };
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const dateSet = (selectedGroupData: any) => {

    setDateRange({
      minDate: new Date(selectedGroupData[0].startDate),
      maxDate: new Date(selectedGroupData[0].endDate),
    });
  }

  useFocusEffect(
    useCallback(() => {
      checkLocationPermission();
      if (id > 0) {
        let selectedGroupData = expenseReports.filter(
          (item: any) => item.expenseReportId === expense.expenseReportId,
        );
        let selectedCategoryData = categories.filter(
          (item: any) => item.categoryId === expense.categoryId,
        );
        if (selectedGroupData.length > 0) {
          dateSet(selectedGroupData)
        }
        date.current = new Date(expense.expenseDate);
        setSelectedGroup(selectedGroupData[0]);
        setSelectedCategory(selectedCategoryData[0]);
      }
    }, []),
  );

  const OnDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate !== undefined) {
      let newDate = selectedDate;
      newDate.setHours(0, 0, 0, 0);
      date.current = newDate;
      ToggledatePicker();
    }
  };

  const handleOpenGallery: any = () => {
    let options: any = {
      includeBase64: true,
      storageOptions: {
        path: 'image',
        mediaType: 'photo',
      },
    };
    launchImageLibrary(options, (Response: any) => {
      const newImage = [...imageData];
      if (Response.didCancel) {
        console.log('User cancelled library');
      } else {
        const fileSize = Response.assets[0].base64.length * (3 / 4) - 2;
        if (fileSize < 5000000) {
          let newImg = true;
          imageData.map((item: any) => {
            if (item.displayName === Response.assets[0].fileName) {
              console.log(Response.assets[0].fileName);
              newImg = false;
            }
          });
          console.log(newImg, 'img');

          if (!newImg) {
            Alert.alert('Imge already added');
            return;
          }
          const date = new Date();
          let imgYear = date.getFullYear();
          let imgMonth = date.getMonth().toString().padStart(2, '0');
          let imgDate = date.getDate().toString().padStart(2, '0');
          let imghour = date.getHours().toString().padStart(2, '0');
          let imgminutes = date.getMinutes().toString().padStart(2, '0');
          let imgSecond = date.getSeconds().toString().padStart(2, '0');
          let imgMilliSecond = date.getMilliseconds();
          let imgname = `IMG_${imgYear}_${imgMonth}_${imgDate}_${imghour}_${imgminutes}_${imgSecond}_${imgMilliSecond}`;

          if (imageData.length < 5) {
            newImage.push({
              base64Image: `data:image/png;base64,${Response.assets[0].base64}`,
              displayName: Response.assets[0].fileName,
              name: imgname,
              isDeleted: 0,
            });
          } else {
            Alert.alert('Can`t add more than five images');
          }
          setImageData(newImage);
        } else {
          setSnackbarMsg('Upload Image within 5MB');
          onToggleSnackBar();
        }
      }
    });
    RBSheetRef.current.close();
  };

  // const handleBottomSheet = () => {
  //   setBSheetItem('Photos');
  //   RBSheetRef.current.open();
  // };

  // const handleOpencamera: any = () => {
  //   let options: any = {
  //     mediaType: 'photo',
  //     quality: 0.8,
  //     includeBase64: true,
  //     cameraType: 'back',
  //   };
  //   try {
  //     launchCamera(options, (Response: any) => {
  //       const newImage = [...imageData];
  //       if (Response.didCancel) {
  //         console.log('User cancelled library');
  //       } else {
  //         if (imageData.length < 5) {
  //           newImage.push({ image: Response.assets[0].base64 });
  //         } else {
  //           Alert.alert('can`t add more than five images');
  //         }
  //         setImageData(newImage);
  //       }
  //       RBSheetRef.current.close();
  //     });
  //   } catch (error) {
  //     console.error('Error launching camera:', error);
  //   }
  // };

  const handleCancel = () => {
    setImageData([]);
    navigation.goBack();
  };

  const handleGroup = () => {
    if (expenseReports.length === 0) {
      setSnackbarMsg('Reports not available');
      onToggleSnackBar();
      return;
    }
    setBSheetItem('Groups');
    setGroupError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    RBSheetRef.current.open();
  };

  const handleGroupChips = (data: any) => {
    setSelectedGroup(data);
    setDateRange({
      minDate: new Date(data.startDate),
      maxDate: new Date(data.endDate),
    });
    if (data.startDate !== undefined) {
      date.current = new Date(data.startDate);
    }
    RBSheetRef.current.close();
  };

  const handlecategory = () => {
    setBSheetItem('Category');
    setCategoryError((prev: any) => {
      return {
        ...prev,
        errorMessage: validationMessages.required,
        touched: true,
      };
    });
    RBSheetRef.current.open();
  };

  const handleCategoryChips = (data: any) => {
    setSelectedCategory(data);
    RBSheetRef.current.close();
  };

  const deleteImage = (image: any) => {
    if (image.expenseAttachmentId > 0) {
      imageData.map((item: any, index: any) => {
        let newImageData = [...imageData];
        if (image.displayName === item.displayName) {
          newImageData[index] = {
            expenseAttachmentId:
              expenseState.expenseAttachments[index].expenseAttachmentId,
            base64Image: item.base64Image,
            displayName: item.displayName,
            name: item.name,
            isDeleted: true,
          };
          setImageData(newImageData);
          console.log(Object.keys(imageData[index]));
        }
      });
    } else if (image.expenseAttachmentId === undefined) {
      const newImageData = imageData.filter(
        (data: any) => data.displayName !== image.displayName,
      );
      setImageData(newImageData);
    }
  };

  const ToggledatePicker = () => {
    setShowDate(!showDate);
  };

  const handleImageCLick = async (image: any) => {
    setVisible(true);
    setModelImage(image);
  };

  const claimPermission: any = permissions.find(
    (each: any) => each.module === Modules.claim,
  );

  const handleClaimSubmit = (handleSubmit: any) => {
    // const newImageData = imageData.map((item: any) => {
    //   return { name: item.name, displayName: item.displayName, base64Image: `data:image/png;base64,${item.base64Image}` };
    // });

    if (selectedCategory.categoryId === undefined) {
      setCategoryError((prev: any) => {
        return {
          ...prev,
          errorMessage: validationMessages.required,
          touched: true,
        };
      });
    }
    handleSubmit();
  };
  const hideModal = () => setVisible(false);

  const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);

  const onDismissSnackBar = () => setVisibleSnackbar(false);

  return (
    <View style={[style.wrapper]}>
      <Portal>
        <Modal
          style={style.modelConatiner}
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={style.modelContent}>
          <View style={style.modelImageContainer}>
            <Image
              source={{ uri: `${modelImage}` }}
              style={{ height: '100%', width: '100%' }}
              resizeMode="contain"
            />
          </View>
          <CancelButton onPress={hideModal} />
        </Modal>
        {
          // Dialog for requesting location
        }
        <Dialog
          visible={locationDialogVisible}
          onDismiss={() => {
            navigation.goBack();
          }}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              To continue, let your device access location and camera
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              mode="text"
              onPress={() => {
                navigation.goBack();
              }}>
              cancel
            </PaperButton>
            <PaperButton mode="text" onPress={checkLocationPermission}>
              ok
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
        {
          // Dialog for redirecting to setting when permission is never ask again
        }
        <Dialog
          visible={settingsDialogVisible}
          onDismiss={() => {
            navigation.goBack();
          }}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {`Allow Expense Tracker to access location and camera. Tap Settings > Permissions and turn Location and camera on `}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              mode="text"
              onPress={() => {
                navigation.goBack();
              }}>
              cancel
            </PaperButton>
            <PaperButton
              mode="text"
              onPress={async () => {
                await Linking.openSettings();
              }}>
              Open settings
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View>
        <Formik
          initialValues={initialFormData}
          validationSchema={claimValidationSchema}
          onSubmit={async values => {
            let res: any;
            try {
              if (
                selectedCategory.categoryId !== undefined
              ) {
                if (id > 0) {

                  let params = {
                    ...values,
                    expenseReportId: selectedGroup ? selectedGroup.expenseReportId : null,
                    categoryId: selectedCategory.categoryId,
                    expenseDate: date.current,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    expenseAttachments: imageData,
                    id: id,
                  };
                  const updateclaimData = {
                    id: id,
                    claimObj: params,
                  };
                  console.debug('this is updatedClaim', updateclaimData)
                  res = await dispatch(updateClaim(updateclaimData));
                  if (res.payload.status) {
                    await dispatch(getClaims());
                    await dispatch(getClaimById(id));
                    navigation.goBack();
                  } else if (res.payload.message) {
                    setSnackbarMsg(res.payload.message);
                    onToggleSnackBar();
                  }
                } else {
                  let params = {
                    ...values,
                    expenseReportId: selectedGroup.expenseReportId !== undefined ? selectedGroup.expenseReportId : null,
                    categoryId: selectedCategory.categoryId,
                    expenseDate: date.current,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    expenseAttachments: imageData,
                  };
                  res = await dispatch(addClaim(params));
                  if (res.payload.status) {
                    await dispatch(getClaims());
                    navigation.goBack();
                  } else if (res.payload.message) {
                    setSnackbarMsg(res.payload.message);
                    onToggleSnackBar();
                  }
                }
              }
            } catch (error) {
              console.error(error);
            }
          }}
          enableReinitialize>
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            values,
            touched,
          }) => (
            <ScrollView contentContainerStyle={style.scrollWrapper}>
              <View
                style={[style.addClaimContainer, { backgroundColor: surface }]}>
                <Pressable onPress={handleGroup}>
                  <Input
                    value={selectedGroup && selectedGroup.name}
                    placeholder="Select Report"
                    title="Reports"
                    editable={false}
                  />
                </Pressable>
                <Pressable onPress={handlecategory}>
                  <Input
                    value={selectedCategory.name}
                    placeholder="Select Category"
                    title="Category"
                    editable={false}
                    helperVisible={
                      categoryError.touched &&
                        categoryError.errorMessage &&
                        (selectedCategory.categoryId < 1 ||
                          selectedCategory.categoryId === undefined)
                        ? true
                        : false
                    }
                    helperErrorMessage={categoryError.errorMessage}
                  />
                </Pressable>
                <Input
                  value={values.description}
                  placeholder="Enter Description"
                  title="Description"
                  handleChange={handleChange('description')}
                  handleBlur={handleBlur('description')}
                  helperVisible={
                    touched.description && errors.description ? true : false
                  }
                  helperErrorMessage={errors.description}
                />
                <Text>Upload image</Text>
                <View style={style.imageContainerWrapper}>
                  <Pressable
                    onPress={handleOpenGallery}
                    style={[style.imageContainer, { borderWidth: 1 }]}>
                    <IconButton icon="camera-plus" />
                  </Pressable>
                  {imageData &&
                    imageData
                      .filter((item: any) => item.isDeleted === 0)
                      .map((item: any, index: number) => {
                        return (
                          <Pressable
                            onPress={() => handleImageCLick(item.base64Image)}
                            style={style.imageContainer}
                            key={index}>
                            <Image
                              source={{
                                uri: id
                                  ? `${item.base64Image}`
                                  : `${item.base64Image}`,
                              }}
                              style={{ height: '100%', width: '100%' }}
                              resizeMode="cover"
                            />
                            <Pressable
                              onPress={() => deleteImage(item)}
                              style={style.imageCancelConatiner}>
                              <Text style={style.imageCancel}>x</Text>
                            </Pressable>
                          </Pressable>
                        );
                      })}
                </View>
                <View>
                  <Pressable onPress={ToggledatePicker}>
                    <Input
                      title={'Date'}
                      value={date.current.toDateString()}
                      placeholder={'Enter Date'}
                      editable={false}
                    />
                  </Pressable>
                  {showDate && Object.keys(selectedGroup).length !== 0 && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={date.current}
                      onChange={OnDateChange}
                      minimumDate={dateRange.minDate}
                      maximumDate={dateRange.maxDate}
                    />
                  )}
                  {showDate && Object.keys(selectedGroup).length === 0 && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={date.current}
                      onChange={OnDateChange}
                    />
                  )}
                </View>
                {!claimPermission.changeClaimStatusPermission && <Input
                  keyboard={'numeric'}
                  value={values.expenseAmount
                  }
                  placeholder="Enter Amount"
                  title="Amount"
                  handleChange={handleChange('expenseAmount')}
                  handleBlur={handleBlur('amount')}
                  helperVisible={
                    touched.expenseAmount && errors.expenseAmount ? true : false
                  }
                  helperErrorMessage={errors.expenseAmount}
                />}
                <Input
                  placeholder="Enter Reference"
                  value={values.reference}
                  title="Reference"
                  handleChange={handleChange('reference')}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CancelButton onPress={() => handleCancel()} />
                  <SubmitButton
                    onPress={() => handleClaimSubmit(handleSubmit)}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
      <RBSheet
        ref={RBSheetRef}
        height={wp(80)}
        openDuration={600}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}>
        {/* {BSheetitem === 'Photos' && (
          <View style={{ height: '100%', justifyContent: 'center' }}>
            <Button title={'Open Camera'} onPress={handleOpencamera} />
            <Button title={'Open gallery'} onPress={handleOpenGallery} />
          </View>
        )} */}
        {BSheetitem === 'Groups' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {expenseReports.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleGroupChips(item)}
                  style={{ margin: '3%' }}
                  selected={
                    item.expenseReportId === selectedGroup.expenseReportId
                  }
                  key={item.expenseReportId}>
                  {item.name}
                </Chip>
              );
            })}
          </ScrollView>
        )}
        {BSheetitem === 'Category' && (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              padding: '5%',
            }}>
            {categories.map((item: any) => {
              return (
                <Chip
                  onPress={() => handleCategoryChips(item)}
                  style={{ margin: '3%' }}
                  selected={item.categoryId === selectedCategory.categoryId}
                  key={item.categoryId}>
                  {item.name}
                </Chip>
              );
            })}
          </ScrollView>
        )}
      </RBSheet>

      {isLoading && id > 0 && <ScreenLoader visible={isLoading} />}
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

const style = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  scrollWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  modelImageContainer: {
    height: '80%',
    width: '100%',
  },
  addClaimContainer: {
    height: '100%',
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  modelContent: {
    padding: 20,
  },
  imageContainerWrapper: {
    flexDirection: 'row',
    marginVertical: wp(2),
    marginTop: wp(4),
  },
  imageContainer: {
    height: wp(12),
    width: wp(12),
    borderRadius: wp(2),
    justifyContent: 'center',
    marginHorizontal: '1%',
    alignItems: 'center',
  },
  addImage: {
    fontSize: 28,
  },
  imageCancelConatiner: {
    height: wp(4),
    width: wp(3.5),
    backgroundColor: 'red',
    alignItems: 'center',
    borderTopLeftRadius: wp(2.5),
    marginTop: '-33%',
    marginLeft: '70%',
  },
  modelConatiner: {
    width: '90%',
    left: '5%',
  },
  imageCancel: {
    marginTop: wp(-0.5),
  },
});

export default AddClaim;
