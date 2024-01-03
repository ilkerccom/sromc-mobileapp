import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, ActivityIndicator, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import ButtonOrange from '../components/ButtonOrange';
import i18n from 'i18n-js';
import ButtonSecondary from '../components/ButtonSecondary';
import Loader from '../components/blocks/Loader';

export default function CreateAccount({ finishAccount }) {

    const [type, setType] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [registerInProgress, setRegisterInProgress] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function login() {
        setLoginInProgress(true);
        await fetch('https://api.sromc.com/user/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then((res) => res.json())
            .then((res) => {
                const token = res.token;
                if (token == null) {
                    Alert.alert(
                        i18n.t('Hata'),
                        i18n.t('KullaniciAdiYaDaSifreYanlis'),
                        [
                            {
                                text: i18n.t('Tamam'),
                                style: "danger",
                            }
                        ],
                        {
                            cancelable: true
                        })
                }
                else {
                    AsyncStorage.setItem("username", username, (err, result) => { });
                    AsyncStorage.setItem("accessToken", token, (err, result) => { });
                    finishAccount();
                }
            }).catch(() => {
                // Return home if error
                setType('');
            });
        setLoginInProgress(false);
    }

    async function createAccount() {
        setRegisterInProgress(true);
        await fetch('https://api.sromc.com/user/create',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((res) => {
                const username = res.username;
                const password = res.password;
                const token = res.token;
                setRegisterInfo({
                    username: username,
                    password: password,
                    token: token
                });
                AsyncStorage.setItem("username", username, (err, result) => { });
                AsyncStorage.setItem("accessToken", token, (err, result) => { });
            }).catch(() => {
                // Return home if error
                setType('');
            });
        setRegisterInProgress(false);
    }

    useEffect(() => {
        if (type == 'register') {
            createAccount();
        }
    }, [type]);


    if (type == '') {
        return (
            <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView>
                    <View style={{ display: 'flex', flex: 1 }}>
                        <View style={styles.header}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Image style={{ marginBottom: 20, width: 120, height: 110 }} source={require('../images/logo.png')} /></View>
                            <Text style={styles.title}>{i18n.t('SonBirAdimKaldi')}</Text>
                            <Text style={styles.desc}>{i18n.t('GirisYapAciklama')}</Text>
                        </View>
                        <ButtonOrange onPress={() => setType('register')} title={i18n.t('HesapOlustur')} />
                        <Text style={{ color: '#ccc', textAlign: 'center' }}>{i18n.t('Veya')}</Text>
                        <ButtonSecondary onPress={() => setType('login')} title={i18n.t('GirisYap')} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    if (type == 'register') {
        return (
            <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView>
                    {
                        registerInProgress ?
                            <View style={styles.info}>
                                <Loader />
                            </View>
                            :
                            <View style={styles.info}>
                                <View style={styles.header}>
                                    <Text style={styles.title}>{i18n.t('Hosgeldin')}</Text>
                                    <Text style={styles.desc}>{i18n.t('HosgeldinAciklama')}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>{i18n.t('KullaniciAdin')}</Text>
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>{registerInfo.username}</Text>
                                    </View>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>{i18n.t('Sifren')}</Text>
                                    <View style={styles.item}>
                                        <Text style={styles.itemText}>{registerInfo.password}</Text>
                                    </View>
                                </View>
                                <Text style={styles.warning}>
                                    {i18n.t('BilgileriKaydetmeyiUnutma')}
                                </Text>
                                <ButtonOrange onPress={finishAccount} title={i18n.t('Baslayalim')} />
                            </View>
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <ScrollView>
                <KeyboardAvoidingView style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={90}>
                    <View style={styles.info}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{i18n.t('GirisYap')}</Text>
                            <Text style={styles.desc}>{i18n.t('VarolanHesabaGirisYap')}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>{i18n.t('KullaniciAdin')}</Text>
                            <View style={styles.item}>
                                <TextInput onChangeText={text => setUsername(text)} value={username} keyboardAppearance={'dark'} placeholder={i18n.t('KullaniciAdin')} placeholderTextColor={'#ccc'} keyboardType={'name-phone-pad'} style={styles.itemText} />
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>{i18n.t('Sifren')}</Text>
                            <View style={styles.item}>
                                <TextInput onChangeText={text => setPassword(text)} value={password} keyboardAppearance={'dark'} placeholder={i18n.t('Sifren')} placeholderTextColor={'#ccc'} secureTextEntry={true} style={styles.itemText} />
                            </View>
                        </View>
                        <ButtonOrange loading={loginInProgress} disabled={loginInProgress} onPress={() => login()} title={i18n.t('GirisYap')} />
                        <TouchableOpacity onPress={() => setType('')} style={{ padding: 5, }}>
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('HesabimYok')}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
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
    info: {
        display: 'flex',
        flex: 1
    },
    infoItem: {
        margin: 25
    },
    infoLabel: {
        textAlign: 'center',
        fontSize: 15,
        color: '#F77F02',
        marginBottom: 4
    },
    item: {
        backgroundColor: '#653A25',
        padding: 15,
        borderRadius: 20
    },
    itemText: {
        color: 'white',
        textAlign: 'center',
        height:30,
        padding:0,
        fontSize: 20
    },
    warning: {
        color: '#A57056',
        textAlign: 'center'
    }
});