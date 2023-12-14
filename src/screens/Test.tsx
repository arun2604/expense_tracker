/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import React from 'react';
import Button from '../components/button/Button';

const Test = () => {
    const handleImageName = () => {
        const date = new Date();
        let imgYear = date.getFullYear();
        let imgMonth = date.getMonth().toString().padStart(2, '0');
        let imgDate = date.getDate().toString().padStart(2, '0');
        let imghour = date.getHours().toString().padStart(2, '0');
        let imgminutes = date.getMinutes().toString().padStart(2, '0');
        let imgSecond = date.getSeconds().toString().padStart(2, '0');
        let imgMilliSecond = date.getMilliseconds();
        let imgname = `IMG_${imgYear}_${imgMonth}_${imgDate}_${imghour}_${imgminutes}_${imgSecond}_${imgMilliSecond}`;
        console.log(imgname);
    };
    return (
        <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Button title={'Click'} onPress={handleImageName} />
        </View>
    );
};

export default Test;
