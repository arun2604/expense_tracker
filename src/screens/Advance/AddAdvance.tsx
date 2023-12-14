import { View, StyleSheet, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../features/Redux/Store";
import { useAppTheme } from "../../../App";
import Input from "../../components/Input";
import RBSheet from "react-native-raw-bottom-sheet";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ScrollView } from "react-native";
import { Chip, Snackbar } from "react-native-paper";
import { SubmitButton } from "../../components/button/Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addAdvance } from "../../features/Redux/thunks/advanceThunk";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AddAdvance = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const { colors } = useAppTheme()
    let users = useAppSelector((state: any) => state.user.users)
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [amount, setAmount] = useState<any>('')
    const RBSheetRef: any = useRef(null);
    const [showDate, setShowDate] = useState(false);
    const date = useRef(new Date());
    const [isUsernameTouched, setIsUsernameTouched] = useState(false)
    const [isAmountTouched, setIsAmountTouched] = useState(false)
    const [amountErrorMsg, setAmountErrorMsg] = useState('*Required')
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const onToggleSnackBar = () => setVisibleSnackbar(!visibleSnackbar);
    const [snackbarMsg, setSnackbarMsg] = useState('');


    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const dateRange = {
        minDate: new Date(),
        maxDate: new Date(),
    };

    const handleUsername = () => {
        RBSheetRef.current.open();
        setIsUsernameTouched(true);
    }
    const handleUserChip = (user: any) => {
        let newUser = []
        newUser.push(user)
        setSelectedUser(newUser);
        RBSheetRef.current.close();
    }
    const handleAmountChange = (amount: any) => {
        setAmount(amount)
        setIsAmountTouched(true)
    }
    const handleSubmit = () => {
        if (selectedUser.length < 1 || amount.length < 1) {
            setSnackbarMsg(selectedUser.length < 1 ? 'Select atleast one user' : 'Enter amount');
            onToggleSnackBar();
            return;
        }
        else {
            let params = {
                accountId: selectedUser.accountId,
                userId: selectedUser[0].userId,
                transactionOn: date.current,
                amount,
                reportId: null
            }
            dispatch(addAdvance(params)).then((data) => {
                if (data.meta.requestStatus === 'rejected') {
                    setSnackbarMsg('Network Error')
                    onToggleSnackBar()
                }
                if (data.payload && data.payload.status) {
                    navigation.navigate('advance')
                }
            }).catch((error: any) => {
                console.info(error.response)
            })
        }
    }
    const ToggledatePicker = () => {
        setShowDate(!showDate);
    };
    const OnDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate !== undefined) {
            let newDate = selectedDate;
            newDate.setHours(0, 0, 0, 0);
            date.current = newDate;
            ToggledatePicker();
        }
    };

    return (
        <View style={style.container}>
            <View style={[style.formContainer, { backgroundColor: colors.background, borderColor: colors.outline }]}>
                <Pressable style={{ marginBottom: 6 }} onPress={handleUsername}>
                    <Input
                        title="User"
                        placeholder="Enter User"
                        editable={false}
                        value={selectedUser.length > 0 ? selectedUser[0].name : ''}
                        helperVisible={
                            isUsernameTouched && selectedUser.length < 1 ? true : false
                        }
                        helperErrorMessage={'*Required'}
                    />
                </Pressable>
                <View style={{ marginBottom: 6 }}>
                    <Input
                        title="Advanve amount"
                        placeholder="Enter advance amount"
                        value={amount}
                        keyboard="numeric"
                        handleChange={handleAmountChange}
                        helperVisible={
                            isAmountTouched && amount.length < 1 ? true : false
                        }
                        helperErrorMessage={amountErrorMsg}
                    />
                </View>
                <Pressable onPress={ToggledatePicker}>
                    <Input
                        title={'Date'}
                        value={date.current.toDateString()}
                        placeholder={'Enter Date'}
                        editable={false}
                    />
                </Pressable>
                {showDate && (
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date.current}
                        onChange={OnDateChange}
                        maximumDate={dateRange.maxDate}
                    />
                )}
                <SubmitButton onPress={handleSubmit} />
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
                <ScrollView
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%',
                        padding: '5%',
                    }}>
                    {
                        users.length > 0 && users.map((user: any) => {
                            return (
                                <Chip
                                    onPress={() => handleUserChip({ ...user, name: user.firstName + ' ' + user.lastName })}
                                    style={{ margin: '3%' }}
                                    selected={
                                        user.accountId === selectedUser.accountId
                                    }
                                    key={user.accountId}>
                                    {user.firstName} {user.lastName}
                                </Chip>
                            )
                        })
                    }
                </ScrollView>

            </RBSheet>
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
    )
}

const style = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        justifyContent: 'center'
    },
    formContainer: {
        borderWidth: 1,
        margin: 10,
        height: 300,
        padding: 10,
        justifyContent: 'center',
        borderRadius: 8
    }
})

export default AddAdvance;
