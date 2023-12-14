import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Card, Checkbox, Snackbar, } from 'react-native-paper'
import { useAppTheme } from '../../../App';
import Label from '../../components/label/label';
import { SubmitButton } from '../../components/button/Button';
import RBSheet from 'react-native-raw-bottom-sheet';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Input from '../../components/Input';
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store';
import { getClaimsByGroupId, getGroup, getGroupSubmittedById, multipleExpensePayment } from '../../features/Redux/thunks/GroupThunks';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

const PaymentDetails = ({ route }: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { allExp, expenseReportId, toggleIsfromPaymennt, groupId } = route.params;
    const reportApprovedAmount = allExp.map((exp: any) => {
        return exp.approvedAmount
    }).reduce((amtOne: string, amtTwo: string) => {
        return Number(amtOne) + Number(amtTwo)
    })

    const advanceDetails: any = useAppSelector(state => state.advance.advanceDetails);
    const reportPaidAmount = allExp.map((exp: any) => {
        return exp.paidAmount
    }).reduce((amtOne: string, amtTwo: string) => {
        return Number(amtOne) + Number(amtTwo)
    })

    const allSelectedExpense = allExp.filter((exp: any) => {
        return exp.approvedAmount !== exp.paidAmount
    })

    const { colors } = useAppTheme();
    const [totalAmount, setTotalAmount] = useState(0);
    const [payableAmount, setPayableAmount] = useState<any>();
    const [showDate, setShowDate] = useState(false);
    const dispatch = useAppDispatch();
    const date = useRef<Date>(new Date());
    const RBSheetRef: any = useRef(null);
    const [selectedExpense, setSelectedExpense] = useState([]);
    const [tempApprovedAmount, setTempApprovedAmount] = useState<any>(allSelectedExpense.map((data: any) => {
        return data.approvedAmount
    }));
    const [amountTextBox, setAmountTextBox] = useState(tempApprovedAmount);
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setTotalAmount(tempApprovedAmount.reduce((a: number, b: number) => {
            return Number(a) + Number(b)
        }))
        setAdvanceAmount(advanceDetails.remainingAdvanceAmount >= totalAmount ? totalAmount : advanceDetails.remainingAdvanceAmount)
    }, [tempApprovedAmount])
    const [advanceAmount, setAdvanceAmount] = useState<any>()
    useEffect(() => {
        setTempApprovedAmount(allSelectedExpense.map((exp: any) => {
            return exp.approvedAmount - exp.paidAmount
        }))
        setAmountTextBox(allSelectedExpense.map((exp: any) => {
            return exp.approvedAmount - exp.paidAmount
        }))
    }, [])

    const handlePayingAmount = (aprAmt: number) => {
        const sum = tempApprovedAmount.reduce((value: any, secValue: any) => {
            return Number(value) + Number(secValue);
        }, 0);
        if (sum >= aprAmt) {
            setPayableAmount(aprAmt)
        }
        else {
            setSnackbarMsg(`Can't add more then ${sum} `);
            setVisibleSnackbar(true)
        }
    };
    console.info(advanceAmount)

    const handlePayNow = () => {

        let newAmount = tempApprovedAmount.reduce((amountOne: number, amountTwo: number) => {
            return Number(amountOne) + Number(amountTwo)
        })
        setPayableAmount(checked ? Math.abs(newAmount - advanceAmount) : newAmount)

        if (allSelectedExpense.length > 0) {
            RBSheetRef.current.open();
        }
    };

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

    const handlePayAmount = async () => {
        let newSelectedExpense: any = []
        let balanceAmount = Math.abs(payableAmount);
        console.log(Number(reportPaidAmount) + Number(payableAmount) + Number(advanceAmount))
        console.log(Number(reportApprovedAmount))
        let isPaymentCompleted = Number(reportApprovedAmount) === Number(reportPaidAmount) + Number(payableAmount) + Number(advanceAmount)
        if (!isPaymentCompleted) {
            allSelectedExpense.forEach((exp: any, index: number) => {
                let amount = tempApprovedAmount[index]
                if (balanceAmount + advanceAmount >= amount) {
                    if (Number(amount) >= Number(exp.approvedAmount)) {
                        newSelectedExpense.push({
                            expenseId: exp.expenseId, claimStatusId: isPaymentCompleted ? 7 : 6,
                            paidAmount: amount, approvedAmount: exp.approvedAmount,
                            transactionOn: date.current, reportId: groupId,
                            deductedAdvance: checked ? advanceAmount : 0
                        })
                        balanceAmount -= amount
                    }
                    else {
                        newSelectedExpense.push({
                            expenseId: exp.expenseId, claimStatusId: 6,
                            paidAmount: amount, approvedAmount: exp.approvedAmount,
                            transactionOn: date.current, reportId: groupId,
                            deductedAdvance: checked ? advanceAmount : 0
                        })
                        balanceAmount -= amount
                    }
                }
                else if (balanceAmount > 0) {
                    newSelectedExpense.push({
                        expenseId: exp.expenseId, claimStatusId: 6,
                        paidAmount: balanceAmount, approvedAmount: exp.approvedAmount,
                        transactionOn: date.current, reportId: groupId,
                        deductedAdvance: checked ? advanceAmount : 0
                    })
                    balanceAmount -= amount
                }
            })
        }
        else {
            allExp.map((exp: any) => {
                newSelectedExpense.push({
                    expenseId: exp.expenseId, claimStatusId: 7,
                    paidAmount: exp.approvedAmount, approvedAmount: exp.approvedAmount,
                    transactionOn: date.current, reportId: groupId,
                    deductedAdvance: checked ? advanceAmount / allExp.length : 0
                })
            })
        }
        let updateData = {
            "expenseList": newSelectedExpense
        }
        console.info(updateData)
        // dispatch(multipleExpensePayment(updateData)).then(async (data) => {
        //     console.log(data)
        //     if (data.meta.requestStatus === 'rejected') {
        //         setSnackbarMsg('Network Error')
        //         setVisibleSnackbar(true)
        //     }
        //     if (data.payload && data.payload.status) {
        //         await dispatch(getGroupSubmittedById(expenseReportId))
        //         await dispatch(getClaimsByGroupId(expenseReportId));
        //         await dispatch(getGroup(groupId));
        //         navigation.navigate('groupDetails', { isFromPaymentDetails: toggleIsfromPaymennt })
        //     }
        // })
    };

    const handleCheckBox = () => {
        setChecked(prev => !prev)
    }
    const handleAdvanceChange = (amount: any) => {
        setAdvanceAmount(amount)
    }
    return (
        <ScrollView contentContainerStyle={{ height: '100%', width: '100%' }}>
            <Card style={styles.cardContainer} elevation={1}>
                <Card.Title title="Payment Details" titleStyle={styles.cardTitle} />
                <Card.Content>
                    {selectedExpense &&
                        <View>
                            <View>
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
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>
                            {advanceDetails && <View>
                                <View style={styles.checkBoxContainer}>
                                    <Text style={{ color: colors.outline }}>Apply Advance</Text>
                                    <Checkbox
                                        status={checked ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheckBox()} />
                                </View>
                                {checked &&
                                    <View>
                                        <Text style={[styles.remainingAdvance, { color: colors.outline }]}>Remaining Advance : {advanceDetails.remainingAdvanceAmount} </Text>
                                        <Input
                                            title={'Advance amount'}
                                            value={String(advanceAmount)}
                                            placeholder={'Enter Advance'}
                                            handleChange={handleAdvanceChange}
                                        />
                                    </View>}
                            </View>}
                            <View>
                                <SubmitButton title='pay' onPress={() => handlePayNow()} />
                            </View>
                            <View style={styles.totalamt}>
                                <Text style={[styles.amount, { color: colors.outline }]}>Total amount = {totalAmount} </Text>
                            </View>
                        </View>
                    }
                    {
                        allSelectedExpense && allSelectedExpense.map((exp: any, index: number) => {
                            return (
                                <View key={exp.expenseId} style={{ flexDirection: 'row', width: '95%' }}>
                                    <View style={[styles.paymentContainer, { borderColor: colors.outline, backgroundColor: colors.background }]}>
                                        <View style={styles.row}>
                                            <Label
                                                title="Date"
                                                value={new Date(exp.expenseDate).toDateString()}
                                            />
                                            <Label
                                                title="Category name"
                                                value={exp.categoryname}
                                            />
                                        </View>
                                        <View style={styles.row} >
                                            <Label
                                                title="Description"
                                                value={exp.description}
                                            />
                                            <Label
                                                title="Amount"
                                                value={
                                                    `₹ ${tempApprovedAmount[index]}`
                                                }
                                            />
                                        </View>

                                    </View>
                                </View>
                            )
                        })
                    }

                </Card.Content>
            </Card>
            <RBSheet
                ref={RBSheetRef}
                height={widthPercentageToDP(50)}
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
                        padding: '8 %',
                    }}>
                    <View style={styles.bsheetInput}>
                        <Input
                            handleChange={handlePayingAmount}
                            title="Amount"
                            placeholder="Enter Amount"
                            keyboard="numeric"
                            value={String(payableAmount)}
                        />
                        <SubmitButton
                            title={'Complete Payment'}
                            onPress={handlePayAmount}
                        />
                    </View>
                </ScrollView>
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
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
        padding: 10,
        flexDirection: 'row'
    },
    cardTitle: {
        fontWeight: '700',
    },
    remainingAdvance: {
        marginBottom: 3,
        fontWeight: '500'
    },
    amountButtons: {
        flexDirection: 'row',
        elevation: 6,
    },
    paymentContainer: {
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 5,
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalamt: {
        // marginLeft: 'auto'
        alignItems: 'center'
    },
    amount: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        textTransform: 'capitalize',
    },
    bsheetInput: {
        width: '90%',
    },
    approveAmountEdit: {
        width: '50%',
        flexDirection: 'row',
    },
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto'
    },
})
export default PaymentDetails;
