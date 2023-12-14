import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { useAppSelector } from '../../features/Redux/Store'
import AdvanceDetailsCard from './AdvanceDetailsCard'
import { useAppTheme } from '../../../App'
import Modules from '../../utilities/Modules'
import { Avatar, Card } from 'react-native-paper'

const AdvanceDetails = () => {
    let advance: any = useAppSelector((state) => state.advance.advance);
    let isAdvanceAvailable = Object.keys(advance).length > 0 && advance.transactionData.length > 0
    const {
        colors: { onSurfaceVariant, outline, background },
    } = useAppTheme();
    const permissions = useAppSelector(state => state.profile.permissions);
    const groupPermission: any = permissions.find(
        (each: any) => each.module === Modules.group,
    );
    let avatarLetter = '';
    let newName = '';
    let balanceAmount = 0

    if (isAdvanceAvailable) {
        let splitName = advance.transactionData[0].userName.split(' ');
        const length = advance.transactionData[0].userName.length;
        splitName.map((item: any) => {
            avatarLetter += item.slice(0, 1);
            newName += item.slice(0, 1).toUpperCase() + item.slice(1, length) + ' ';
        });
        balanceAmount = advance.paymentDetails.totalAdvanceAmount - advance.paymentDetails.paidAdvanceamount
    }

    return (
        <View style={{ margin: 10 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Card style={{ margin: 6, paddingVertical: 8 }}>
                    <Card.Content style={{ flexDirection: 'row' }} >
                        <View style={{ flexDirection: 'row', flex: 0.5, alignItems: 'center' }}>
                            <Avatar.Text size={30} style={{ marginRight: 10 }} label={avatarLetter.toUpperCase()} />
                            <Text style={{ color: outline, fontWeight: '600' }}>
                                {Object.keys(advance).length > 0 ? newName : ''}
                            </Text>
                        </View>
                        <View style={{ flex: 0.5, width: '100%', }}>
                            <Text style={{ color: outline, fontWeight: '600' }}>
                                Total advance         : {isAdvanceAvailable ? advance.paymentDetails.totalAdvanceAmount : ''}
                            </Text>
                            <Text style={{ color: outline, fontWeight: '600', marginBottom: 3 }}>
                                Deducted amount  : {isAdvanceAvailable ? advance.paymentDetails.paidAdvanceamount : ''}
                            </Text>
                            <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'black' }} />
                            <Text style={{ color: outline, fontWeight: '600' }}>
                                Remaining amount : {isAdvanceAvailable ? balanceAmount : ''}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
                {
                    isAdvanceAvailable &&
                    advance.transactionData.map((data: any, index: number) => {
                        return (
                            <View key={index}>
                                <AdvanceDetailsCard advance={data} />
                            </View>
                        )
                    })
                }

            </ScrollView>
        </View>
    )
}

export default AdvanceDetails