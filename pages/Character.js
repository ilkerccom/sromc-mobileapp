import i18n from 'i18n-js';
import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, RefreshControl, Text, View, KeyboardAvoidingView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { jsonConvert, raceType } from '../src/helpers';
import AsyncStorage from '@react-native-community/async-storage'
import Academy from './Character/Academy';
import Commands from './Character/Commands';
import General from './Character/General';
import Guild from './Character/Guild';
import Inventory from './Character/Inventory';
import Messages from './Character/Messages';
import Party from './Character/Party';
import Pets from './Character/Pets';
import Quests from './Character/Quests';
import { Image } from 'react-native';

export default function Character({ route, navigation }) {

    const scrollRef = useRef();
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('general')
    const [detail, setDetail] = useState(null);
    const [dataReceived, setDataReceived] = useState(false);

    const { charName, charId, token } = route.params;

    async function getInfo() {
        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/charinfo/detail',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    charId: charId,
                    token: token
                })
            })
            .then((res) => res.json())
            .then((res) => {

                // Character
                const jsonCharacter = jsonConvert(res.character);
                delete res.character;
                res.character = jsonCharacter;

                // Finish
                setDetail(res);
                setDataReceived(true);
            }).catch(() => {
            });
    }

    function refresh() {
        getInfo();
    }

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    useEffect(() => {
        getInfo();
    }, []);

    useEffect(() => {
        let _timer;
        _timer = setInterval(() => {
            getInfo();
        }, 2500);
        return () => {
            clearInterval(_timer);
        };
    }, []);


    return (
        <>
            <View style={styles.border}></View>
            {
                dataReceived ?
                    <View style={styles.titleInfo}>
                        <Text style={styles.titleText}>{detail != null ? 'Level ' + detail.character.level + ' (' + raceType(detail.character.model) + ')' : '-'}</Text>
                        <Text style={styles.titleText}>{detail != null ? detail.character.server : '-'}</Text>
                    </View>
                    : null
            }

            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'row' }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                {
                    dataReceived ?
                        <View style={styles.sidebar}>
                            <ScrollView style={{ paddingTop: 0 }}>
                                <TouchableOpacity onPress={() => setActiveTab('general')} style={activeTab == 'general' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'general' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/general.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('GENEL')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('messages')} style={activeTab == 'messages' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'messages' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/messages.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('MESAJLAR')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('inventory')} style={activeTab == 'inventory' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'inventory' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/inventory.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('ENVANTER')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('academy')} style={activeTab == 'academy' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'academy' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/academy.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('AKADEMI')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('party')} style={activeTab == 'party' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'party' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/party.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('PARTI')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('guild')} style={activeTab == 'guild' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'guild' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/guild.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>GUILD</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('quests')} style={activeTab == 'quests' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'quests' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/quests.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('GOREVLER')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('pets')} style={activeTab == 'pets' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'pets' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/pets.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('PETLER')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('commands')} style={activeTab == 'commands' ? styles.sidebarBtnActive : styles.sidebarBtn}>
                                    <Image style={activeTab == 'commands' ? styles.sidebarIconActive : styles.sidebarIcon} source={require('../images/actions/actions.png')} width={38} height={38} resizeMode={'stretch'} resizeMethod={'scale'} />
                                    <Text style={styles.miniText}>{i18n.t('KOMUTLAR')}</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        : null
                }

                <ScrollView
                    ref={scrollRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refresh}
                            colors={['#fff']}
                            tintColor={'#fff'}
                        />
                    }>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
                            {dataReceived ?
                                <>
                                    {
                                        /*
                                        <ScrollView horizontal showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={styles.scrollViewChild}>
                                        <View style={styles.buttons}>
                                            
                                            <TouchableOpacity onPress={() => setActiveTab('general')} style={activeTab == 'general' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Genel')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('messages')} style={activeTab == 'messages' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Mesajlar')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('inventory')} style={activeTab == 'inventory' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Envanter')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('academy')} style={activeTab == 'academy' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Akademi')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('party')} style={activeTab == 'party' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Parti')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('guild')} style={activeTab == 'guild' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Guild')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('quests')} style={activeTab == 'quests' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Gorevler')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('pets')} style={activeTab == 'pets' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Petler')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setActiveTab('commands')} style={activeTab == 'commands' ? styles.buttonActive : styles.button}>
                                                <Text style={styles.buttonText}>{i18n.t('Komutlar')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                    */
                                    }

                                </> : null}
                            <View style={{ marginTop: 0, paddingBottom: 60, flex: 1 }}>
                                {
                                    activeTab == 'general' ?
                                        <>
                                            <General detail={detail} charId={charId} navigation={navigation} />
                                        </>
                                        : null
                                }
                                {
                                    activeTab == 'messages' ?
                                        <Messages detail={detail.messages} charId={charId} charName={charName} scrollToTop={scrollToTop} />
                                        : null
                                }
                                {
                                    activeTab == 'inventory' ?
                                        <Inventory detail={detail} scrollToTop={scrollToTop} />
                                        : null
                                }
                                {
                                    activeTab == 'party' ?
                                        <Party detail={detail.party} charId={charId} />
                                        : null
                                }
                                {
                                    activeTab == 'guild' ?
                                        <Guild guild={detail.guild} union={detail.guild_union} charId={charId} />
                                        : null
                                }
                                {
                                    activeTab == 'academy' ?
                                        <Academy detail={detail.academy} />
                                        : null
                                }
                                {
                                    activeTab == 'quests' ?
                                        <Quests questsData={detail.quests} />
                                        : null
                                }
                                {
                                    activeTab == 'pets' ?
                                        <Pets pets={detail.pets} />
                                        : null
                                }
                                {
                                    activeTab == 'commands' ?
                                        <Commands detail={detail.character} inventory={detail.inventory} status={detail.status} charName={charName} party={detail.party} charId={charId} />
                                        : null
                                }
                            </View>
                        </ImageBackground>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    border: {
        width: '100%',
        height: 1,
        backgroundColor: '#F77F02'
    },
    sidebar: {
        width: 48,
        display: 'flex',
        marginLeft: 0,
        borderRightWidth:1,
        borderRightColor: '#653A25',
    },
    sidebarBtn: {
        width: 48,
        height: 48,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sidebarBtnActive: {
        width: 48,
        height: 48,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#653A25'
    },
    sidebarIcon: {
        width: 48,
        height: 48,
        opacity: 0.3
    },
    sidebarIconActive: {
        width: 48,
        height: 48
    },
    miniText: {
        fontSize:5,
        color:'white'
    },
    root: {
        flex: 1,
        minHeight: '100%',
    },
    mainTitle: {
        fontSize: 30,
        color: '#ccc',
        fontWeight: '100',
        marginBottom: 15
    },
    bg: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 20
    },
    titleInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#653A25',
        borderBottomWidth: 1,
        padding: 15
    },
    titleText: {
        fontSize: 17,
        color: '#F77F02'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 15,
        height: 45,
    },
    button: {
        backgroundColor: '#A57056',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 11,
        textAlign: 'center',
        marginBottom: 3,
        marginRight: 6,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonActive: {
        backgroundColor: '#F77F02',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 3,
        marginRight: 6,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 17
    },
    scrollViewChild: {
        height: 70,
        maxHeight: 70,
        minHeight: 70
    }
});