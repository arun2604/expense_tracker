import { View, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AddIconFAB from '../../components/FAB/addIconFAB'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAppDispatch, useAppSelector } from '../../features/Redux/Store'
import { getUsersOnly } from '../../features/Redux/thunks/UserThunks'
import { getAllByEventType, getTransactionByAccountId } from '../../features/Redux/thunks/advanceThunk'
import { Snackbar } from 'react-native-paper'
import AdvanceCard from './AdvanceCard'
import Modules from '../../utilities/Modules'
import AdvanceDetails from './AdvanceDetails'

const Advance = () => {
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useAppDispatch()
    let allAdvance = useAppSelector((state) => state.advance.allAdvance)

    const permissions = useAppSelector(state => state.profile.permissions);
    const groupPermission: any = permissions.find(
        (each: any) => each.module === Modules.group,
    );

    useFocusEffect(
        useCallback(() => {
            groupPermission.changeGroupStatusPermission ? dispatch(getAllByEventType())
                : dispatch(getTransactionByAccountId('null'))
        }, [])
    )

    // useEffect(() => {
    //     groupPermission.changeGroupStatusPermission ? dispatch(getAllByEventType())
    //         : dispatch(getTransactionByAccountId('null'))
    // }, [])

    const handleFab = async () => {
        dispatch(getUsersOnly()).then((data: any) => {
            if (data.payload.status) {
                navigation.navigate('addAdvance')
            }
            else {
                setSnackbarMsg(data.payload.message)
                setVisibleSnackbar(true)
            }
        })
    }
    return (
        <View style={{ height: '100%', width: '100%', padding: groupPermission.changeGroupStatusPermission ? 10 : 0 }}>
            {groupPermission.changeGroupStatusPermission ? <ScrollView>
                {
                    allAdvance.length > 0 && allAdvance.map((advance, index) => {
                        return (
                            <AdvanceCard key={index} advanceDetails={advance} />
                        )
                    })
                }
            </ScrollView> : <AdvanceDetails />}
            {groupPermission.changeGroupStatusPermission && <AddIconFAB onPress={handleFab} />}
            <Snackbar
                visible={visibleSnackbar}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Cancel',
                }}>
                {snackbarMsg}
            </Snackbar>
        </View>
    )
}

export default Advance