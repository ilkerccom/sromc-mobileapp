import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { ImageBackground, RefreshControl, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import Percentage from '../Percentage';

export default function Server({ name, capacity, status }) {
    return (
        <>
            <View style={status ? styles.server : styles.serverClosed}>
                <Text style={styles.serverName}>{name}</Text>
                {
                    capacity == 100 && status ?
                        <View style={{ width: 70 }}>
                            <Percentage perc={capacity} color={'red'} />
                        </View>
                        : null
                }
                {
                    capacity >= 90 && capacity < 100 && status ?
                        <View style={{ width: 70 }}>
                            <Percentage perc={90} color={'#D34A4A'} />
                        </View>
                        : null
                }
                {
                    capacity >= 50 && capacity < 90 && status ?
                        <View style={{ width: 70 }}>
                            <Percentage perc={capacity} color={'orange'} />
                        </View>
                        : null
                }
                {
                    capacity < 50 && status ?
                        <View style={{ width: 70 }}>
                            <Percentage perc={capacity} color={'green'} />
                        </View>
                        : null
                }
                {
                    status ?
                        <Text style={styles.isOpen}>{i18n.t('Acik')}</Text> :
                        <Text style={styles.isClose}>{i18n.t('Kapali')}</Text>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    server: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        backgroundColor: '#653A25',
        padding: 10,
        borderRadius: 5,
        marginBottom: 4
    },
    serverClosed: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        backgroundColor: '#653A25',
        padding: 10,
        borderRadius: 5,
        marginBottom: 4,
        opacity: 0.7
    },
    serverName: {
        color: '#fff',
        maxWidth:'50%',
        flexGrow: 1
    },
    status: {
        marginRight: 25
    },
    isOpen: {
        color: '#3ABA13',
        width: 55,
        textAlign: 'right'
    },
    isClose: {
        color: '#D34A4A',
        fontWeight: 'bold',
        width: 55,
        textAlign: 'right'
    }
});