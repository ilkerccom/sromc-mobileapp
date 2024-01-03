import React from 'react';
import { Text, StyleSheet, View } from 'react-native'

export default function TwoColumnPerc({ title, perc, color }) {
    return (
        <>
            <View style={styles.main}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.desc}>
                    <View style={styles.perc}>
                        <Text style={styles.percText}>{perc}%</Text>
                        <View style={styles.percHolder}>
                            <View style={{ borderRadius: 5, height: 6, backgroundColor: color, width: perc + '%' }}></View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5
    },
    title: {
        minWidth:50,
        fontSize: 16,
        color: '#A57056'
    },
    desc: {
        flexGrow:1,
        marginLeft:25,
        fontSize: 16,
        color: '#F77F02'
    },
    perc: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        flexGrow:1
    },
    percText: {
        color: '#A57056',
        fontSize: 13,
        minWidth:55
    },
    percHolder: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        flex:1,
        marginRight:10,
        height: 10,
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: 5
    }
});