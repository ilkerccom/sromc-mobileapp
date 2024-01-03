import i18n from 'i18n-js';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native'

export default function Quest({name, completed}){
    return(
        <>
            <View style={styles.main}>
                <Text style={styles.name}>{name}</Text>
                {
                    completed ? 
                    <Text style={styles.completed}>{i18n.t('TeslimEdilecek')}</Text>
                    :
                    <Text style={styles.notcompleted}>{i18n.t('DevamEdiyor')}</Text>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        backgroundColor:'#653A25',
        borderRadius:5,
        padding:15,
        marginBottom:4,
        display:'flex',
        justifyContent:'space-between'
    },
    name: {
        color:'#fff',
        marginBottom:5
    },
    completed: {
        color:'#3ABA13',
        fontWeight:'bold'
    },
    notcompleted: {
        color:'#F77F02'
    }
});