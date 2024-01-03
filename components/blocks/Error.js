import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export default function ErrorMessage({ message }) {
    return (
        <>
            <View style={styles.main}>
                <Text style={styles.text}>{message}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        backgroundColor:'#D34A4A',
        padding:15,
        marginBottom:40,
        borderRadius: 10
    },
    text: {
        color:'#fff',
        textAlign:'center'
    }
});