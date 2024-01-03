import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import i18n from 'i18n-js';
import RNRestart from 'react-native-restart';

export default function Prefences({ navigation }) {

    const [username, setUsername] = useState('NONAME');

    useEffect(() => {
        const getUsername = async () => {
            const _username = await AsyncStorage.getItem('username');
            if (_username != null) {
                setUsername(_username);
            }
        }
        getUsername();
    }, []);


    function logout() {
        Alert.alert(
            i18n.t('CikisYap'),
            i18n.t('CikisYapAciklama'),
            [
                {
                    text: i18n.t('Vazgec'),
                    style: "danger",
                },
                {
                    text: i18n.t('CikisYap'),
                    style: "destructive",
                    onPress: () => approveLogout(),
                },
            ],
            {
                cancelable: true
            })
    }

    async function approveLogout() {
        const a = await AsyncStorage.removeItem('accessToken');
        const b = await AsyncStorage.removeItem('username');
        RNRestart.Restart();
        //navigation.navigate('Chars', { isResetted: true })
    }

    async function changeLocale(locale) {
        i18n.locale = locale;
        const _t = await AsyncStorage.setItem('selectedLang', locale);
        navigation.navigate('Chars', { languageChanged: true })
    }

    let activeLocale = i18n.locale;
    if (activeLocale.indexOf('-') > 0) {
        activeLocale = activeLocale.split('-')[0];
    }

    return (
        <>
            <View style={styles.border}></View>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
                            <View style={styles.main}>
                                <Image style={{ width: 110, height: 100 }} source={require('../images/logo.png')} />
                                <Text style={styles.textBig}>SROMC v1.0.0</Text>
                                <Text style={styles.text}>support@sromc.com</Text>
                                <Text style={styles.textIlkerc}>by ILKERC</Text>
                            </View>
                            <View style={styles.buttons}>
                                <TouchableOpacity onPress={() => { Linking.openURL('https://sromc.com') }} style={styles.button}>
                                    <Text style={styles.buttonText}>{i18n.t('SiteyiZiyaretEt')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { Linking.openURL('https://github.com/ilkerccom/sromc-plugin/releases') }} style={styles.button}>
                                    <Text style={styles.buttonText}>{i18n.t('EklentiyiIndir')} (phBot)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>UID: {username}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => logout()} style={styles.button}>
                                    <Text style={styles.buttonExit}>{i18n.t('CikisYap')}</Text>
                                </TouchableOpacity>
                                <Text style={styles.langText}>Change Language</Text>
                                <TouchableOpacity onPress={() => changeLocale('en')} style={activeLocale == 'en' ? styles.buttonPassive : styles.button}>
                                    <Text style={styles.buttonText}>English</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => changeLocale('tr')} style={activeLocale == 'tr' ? styles.buttonPassive : styles.button}>
                                    <Text style={styles.buttonText}>Türkçe</Text>
                                </TouchableOpacity>
                            </View>
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
        marginBottom:50
    },
    bg: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    main: {
        display: 'flex',
        alignItems: 'center'
    },
    textBig: {
        fontSize: 17,
        marginTop: 15,
        color: '#A57056'
    },
    text: {
        color: '#A57056'
    },
    textIlkerc: {
        marginTop: 15,
        color: '#A57056'
    },
    buttons: {
        marginTop: 50
    },
    button: {
        backgroundColor: '#653A25',
        borderRadius: 20,
        padding: 10,
        marginBottom: 4
    },
    buttonPassive: {
        backgroundColor: '#653A25',
        borderRadius: 20,
        padding: 10,
        marginBottom: 4,
        opacity: 0.4
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center'
    },
    buttonExit: {
        color: '#D34A4A',
        textAlign: 'center'
    },
    buttonUser: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 5
    },
    langText: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: 15,
        marginTop: 30,
        marginBottom: 12
    }
});