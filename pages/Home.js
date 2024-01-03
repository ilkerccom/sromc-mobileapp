import React, { useEffect, useState } from 'react';
import { ImageBackground, RefreshControl, Text, View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import CharacterBlock from '../components/blocks/CharacterBlock';
import NoContent from '../components/blocks/NoContent';
import ButtonOrange from '../components/ButtonOrange';
import AsyncStorage from '@react-native-community/async-storage'
import { jsonConvert } from '../src/helpers';
import i18n from 'i18n-js';

export default function Home({ route, navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const [chars, setChars] = useState([]);
    const [dataReceived, setDataReceived] = useState(false);
    const { isResetted, languageChanged, charDeleted, charAdded } = route.params || false;

    async function getChars() {
        setRefreshing(true);
        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/charinfo/get',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then((res) => res.json())
            .then((res) => {
                for (let i = 0; i < res.length; i++) {
                    const json = jsonConvert(res[i].character);
                    delete res[i].character;
                    res[i].character = json;
                }
                setChars(res);
            }).catch(() => {
            });
        setRefreshing(false);
        setDataReceived(true);
    }

    useEffect(() => {
        getChars();
    }, []);

    useEffect(() => {
        getChars();
    }, [charDeleted, charAdded]);

    function refresh() {
        getChars();
    }


    function charDetail(charName, charId, latestUpdate) {
        if (latestUpdate > 5) {
            Alert.alert(
                i18n.t('KarakteriSil'),
                i18n.t('KarekterUzunSuredirYok'),
                [
                    {
                        text: i18n.t('Vazgec'),
                        style: "danger",
                        //onPress: () => navigation.navigate('Character', { charName: charName, charId: charId, token: '' }),
                    },
                    {
                        text: i18n.t('Sil'),
                        style: "destructive",
                        onPress: () => approveRemove(charId),
                    },
                ],
                {
                    cancelable: true
                })
        }
        else {
            navigation.navigate('Character', { charName: charName, charId: charId, token: '', name: charName })
        }
    }

    async function approveRemove(charId) {
        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/charinfo/delete',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    charId: charId
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.success == true) {
                    getChars();
                }
            }).catch(() => {
            });
    }

    return (
        <>
            <View style={styles.border}></View>
            <View style={{ flex: 1 }}>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={['#fff']}
                        tintColor={'#fff'}
                    />
                }>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>

                            {
                                dataReceived && chars.length == 0 ?
                                    <NoContent title={i18n.t('KarakterYok')} desc={i18n.t('KarakterEkleyerekBasla')} />
                                    : null
                            }
                            {
                                !dataReceived ?
                                    <ActivityIndicator color={'#fff'} size={'large'} /> : null
                            }
                            {
                                chars.map((char, i) => {
                                    return (
                                        <CharacterBlock
                                            key={char.charId}
                                            charId={char.charId}
                                            charName={char.charName}
                                            level={char.character.level}
                                            server={char.server}
                                            serverStatus={char.serverStatus}
                                            status={char.status}
                                            model={char.character.model}
                                            latestUpdate={char.lastUpdateMinutes}
                                            charDetail={charDetail}
                                        />
                                    )
                                })
                            }


                            <ButtonOrange onPress={() => navigation.navigate('AddCharacter')} title={i18n.t('YeniKarakterEkle')}></ButtonOrange>
                        </ImageBackground>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    border: {
        width: '100%',
        height: 1,
        backgroundColor: '#F77F02'
    },
    root: {
        flex: 1,
        minHeight: '100%',
    },
    bg: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    serverStats: {
        backgroundColor: '#653A25',
        padding: 5,
        borderRadius: 5,
        marginBottom: 15,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});