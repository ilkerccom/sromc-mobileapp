import React from 'react';
import { Image, View } from 'react-native'

export default function TabBarIcon({ active, inActive, focused }) {
    return (
        <>
            <Image style={{ width: 32, height: 32 }} width={32} height={32} source={focused ? require(active) : require(inActive)} />
        </>
    )
}