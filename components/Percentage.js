import React from 'react';
import { View, StyleSheet } from 'react-native'

export default function Percentage({ perc, color }) {
    return (
        <View style={styles.main}>
            <View style={styles.percHolder}>
                <View style={{ width: perc + '%', height: 5, borderRadius:10, backgroundColor: color }}></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    percHolder: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        flex: 1,
        width: '100%',
        minWidth: '100%',
        height: 8,
        borderRadius: 10,
        backgroundColor: '#fff'
    }
});