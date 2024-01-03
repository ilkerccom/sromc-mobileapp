import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

export default function ButtonSecondary({ onPress, title, loading = false }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            {loading ?
                <ActivityIndicator color={'#fff'} style={styles.loader} size={'small'} />
                :
                <Text style={styles.buttonText}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        textAlign: 'center',
        borderRadius: 20,
        padding: 15,
        margin: 25
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16
    }
});