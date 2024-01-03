import React from 'react';
import { Text, StyleSheet, View } from 'react-native'

export default function TwoColumn({ title, desc }) {
    return (
        <>
            <View style={styles.main}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:5,
        paddingBottom:5
    },
    title: {
        fontSize: 16,
        color: '#A57056'
    },
    desc: {
        fontSize: 16,
        color: '#F77F02'
    }
});