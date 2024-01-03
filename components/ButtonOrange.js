import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

export default function ButtonOrange({ onPress, title, disabled = false, loading = false }) {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.button}>
            {loading ?
                <ActivityIndicator color={'#000'} style={styles.loader} size={'small'} />
                :
                <Text style={styles.buttonText}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F77F02',
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