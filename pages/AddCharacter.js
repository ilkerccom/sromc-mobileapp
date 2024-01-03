import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, View, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native'
import CharacterBlock from '../components/blocks/CharacterBlock';
import NoContent from '../components/blocks/NoContent';
import ButtonOrange from '../components/ButtonOrange';
import AsyncStorage from '@react-native-community/async-storage'
import i18n from 'i18n-js';
import ErrorMessage from '../components/blocks/Error';

export default function AddCharacter({ navigation }) {

    const [charId, setCharId] = useState('');
    const [charPass, setCharPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    

    async function addChar() {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/charinfo/add',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    charId: charId,
                    charPassword: charPass
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.success == true) {
                    setError(false);
                    navigation.navigate('Chars', { charAdded: charId })
                }
                else {
                    setError(true);
                }
            }).catch(() => {
            });
        setLoading(false);
    }

    return (
        <>
            <View style={styles.border}></View>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
                            {
                                error ? 
                                <ErrorMessage message={i18n.t('KarakterBulunamadi')} />
                                : null
                            }
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Char ID</Text>
                                <View style={styles.item}>
                                    <TextInput maxLength={9} onChangeText={text => setCharId(text)} value={charId} keyboardAppearance={'dark'} keyboardType={'number-pad'} placeholderTextColor={'#B7B7B7'} placeholder='Char ID' style={styles.itemText} />
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Char Pass</Text>
                                <View style={styles.item}>
                                    <TextInput onChangeText={text => setCharPass(text)} value={charPass} keyboardAppearance={'dark'} autoCapitalize={'none'} secureTextEntry={true} keyboardType={'default'} placeholderTextColor={'#B7B7B7'} placeholder='Char Pass' style={styles.itemText} />
                                </View>
                            </View>
                            <Text style={styles.warning}>
                                {i18n.t('BilgilerPHBot')}
                            </Text>
                            <ButtonOrange disabled={loading} loading={loading} onPress={() => addChar()} title={i18n.t('Ekle')} />
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
    info: {
        height: '100%',
        justifyContent: 'center',
        padding: 30
    },
    infoItem: {
        marginBottom: 30
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