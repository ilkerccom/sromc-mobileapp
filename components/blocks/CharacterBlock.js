import i18n from 'i18n-js';
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

export default function CharacterBlock({ charId, charName, level, server, serverStatus, status, latestUpdate, charDetail, model = 1907 }) {
    return (
        <>
            <TouchableOpacity onPress={() => charDetail(charName, charId, latestUpdate)}>
                <View style={styles.root}>
                    <View style={styles.imageHolder}>
                        <Image width={50} height={70} style={styles.charImage} source={{ uri: 'https://sromc.com/_chars/' + model + '.png' }} />
                    </View>
                    <View style={styles.charInfo}>
                        <Text style={styles.charName}>{charName}</Text>
                        <Text style={styles.level}>Level {level}</Text>
                        <Text style={styles.server}>{server}</Text>
                    </View>
                    <View style={styles.status}>
                        {
                            latestUpdate > 5 ?
                                <>
                                    <Image width={30} height={30} style={styles.statusImage} source={require('../../images/info.png')} />
                                    {serverStatus == false ?
                                        <Text style={styles.maintance}>{i18n.t('SunucuBakimda')}</Text>
                                        :
                                        <Text style={styles.disconnected}>{i18n.t('BaglantiYok')}</Text>
                                    }
                                </>                       
                                :
                                status == 'botting' ?
                                    <>
                                        <Image style={styles.statusImage} source={require('../../images/running.png')} />
                                        <Text style={styles.running}>{i18n.t('BotCalisiyor')}</Text>
                                    </>
                                    :
                                    <>
                                        <Image resizeMethod={'resize'} style={styles.statusImage} source={require('../../images/notrunning.png')} />
                                        <Text style={styles.notRunning}>{i18n.t('BotCalismiyor')}</Text>
                                    </>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#653A25',
        paddingBottom: 15
    },
    imageHolder: {

    },
    charImage: {
        width: 50,
        height: 70,
        borderRadius:5,
        backgroundColor: '#653A25'
    },
    charInfo: {
        flexGrow: 1,
        display: 'flex',
        marginLeft: 15
    },
    charName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    level: {
        color: '#F77F02',
        fontSize: 14,
        flexGrow: 1
    },
    server: {
        color: '#A57056'
    },
    statusImage: {
        marginBottom: 10,
        width: 30,
        height: 30,
    },
    status: {
        display: 'flex',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    running: {
        color: '#3ABA13'
    },
    notRunning: {
        color: '#D34A4A'
    },
    disconnected: {
        color: '#A57056'
    },
    maintance: {
        color: 'yellow'
    }
});