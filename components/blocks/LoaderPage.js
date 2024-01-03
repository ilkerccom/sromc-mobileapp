import i18n from 'i18n-js';
import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native'

export default function LoaderPage() {
    return (
        <View style={styles.header}>
            <ActivityIndicator style={styles.icon} color={'#fff'} size={'large'} />
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
    icon: {
        marginBottom:25
    }
});