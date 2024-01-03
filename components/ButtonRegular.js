import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

export default function ButtonRegular({ onPress, title, isDanger = false, disabled = false, loading = false }) {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={ disabled ? styles.buttonDisabled : styles.button}>
            {loading ?
                <ActivityIndicator color={'#000'} style={styles.loader} size={'small'} />
                :
                <Text style={isDanger ? styles.buttonTextDanger : styles.buttonText}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#653A25',
        textAlign: 'center',
        borderRadius: 10,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:4,
        paddingBottom:4,
        minWidth:80,
        display:'flex',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonDisabled: {
        backgroundColor: '#653A25',
        textAlign: 'center',
        borderRadius: 10,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:4,
        paddingBottom:4,
        minWidth:80,
        opacity:0.5,
        display:'flex',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 14
    },
    buttonTextDanger: {
        color: 'yellow',
        textAlign: 'center',
        fontSize: 14
    }
});