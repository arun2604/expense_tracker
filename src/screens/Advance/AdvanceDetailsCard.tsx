import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper';
import { useAppTheme } from '../../../App';
import Label from '../../components/label/label';

const AdvanceDetailsCard = (props: any) => {
    const { advance } = props;
    const {
        colors: { outline, background },
    } = useAppTheme();
    return (
        <View>
            <Card
                elevation={0}
                style={[styles.container, { backgroundColor: background, borderColor: outline }]}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 5 }}>
                        <View>
                            <Text style={{ color: outline }}>Date</Text>
                            <Text style={{ color: outline, fontWeight: '500' }}>{new Date(advance.transactionOn).toDateString()}</Text>
                        </View>
                        <View>
                            <Text style={{ color: outline }}>Advance amount</Text>
                            <Text style={{ color: outline, fontWeight: '500' }}>{advance.transactionType == "CREDIT" ? '+' : '-'} {advance.amount}</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderWidth: 1
    },
})

export default AdvanceDetailsCard