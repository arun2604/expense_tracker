import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper';
import { useAppTheme } from '../../../App';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTransactionByAccountId } from '../../features/Redux/thunks/advanceThunk';
import { useAppDispatch } from '../../features/Redux/Store';

const AdvanceCard = (props: any) => {
    const { advanceDetails } = props;
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useAppDispatch()

    const {
        colors: { onSurfaceVariant, outline, background },
    } = useAppTheme();

    const handleAdvanceDetails = () => {
        dispatch(getTransactionByAccountId(advanceDetails.accountId)).then((data) => {
            if (data.payload.status) {
                navigation.navigate('advanceDetails')
            }
        })
    }

    return (
        <ScrollView>
            <Card onPress={handleAdvanceDetails}
                elevation={0}
                style={[styles.container, { backgroundColor: background, borderColor: outline }]}>
                <Card.Content>
                    <View style={styles.titleContainer}>
                        <Text style={{ color: outline, fontWeight: '500' }}>User Name</Text>
                        <Text style={{ color: outline, fontWeight: '500' }}>Total Advance </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: '2%' }}>
                        <Text style={{ color: outline }}>{advanceDetails.userName}</Text>
                        <Text style={{ color: outline }}>{advanceDetails.amount}</Text>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderWidth: 1
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: '1%'
    }
})

export default AdvanceCard