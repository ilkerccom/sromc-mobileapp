import i18n from 'i18n-js';
import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'

//await new Promise(r => setTimeout(r, 200000));

export default function Loader({showTitle = true, showDesc = true}) {
    return (
        <View style={styles.header}>
            <ActivityIndicator style={styles.icon} color={'#fff'} size={'large'} />
            { showTitle ? <Text style={styles.title}>{i18n.t('LutfenBekleyin')}</Text> : null }
            { showDesc ?  <Text style={styles.desc}>{i18n.t('IsleminizSuruyor')}</Text> : null }
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        textAlign: 'center',
        padding: 20,
        marginBottom: 20
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    desc: {
        color: '#B7B7B7',
        fontSize: 15,
        padding: 10,
        marginLeft: 30,
        marginRight: 30,
        textAlign: 'center'
    },
    icon: {
        marginBottom:25
    }
});