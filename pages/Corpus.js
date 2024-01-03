import React, { useEffect, useState } from 'react';
import { ImageBackground, RefreshControl, Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import NoContent from '../components/blocks/NoContent';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage'
import Monster from '../components/blocks/Monster';
import { jsonConvert } from '../src/helpers';

export default function Corpus({ route, navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [monsters, setMonsters] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [level, setLevel] = useState(0);
    const [dataReceived, setDataReceived] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [chars, setChars] = useState([]);
    const [activeChar, setActiveChar] = useState(0);

    const categories = [
        { c: 'for_my_level', name: i18n.t('BanaUygun') },
        { c: 'china_monster', name: i18n.t('Cin') },
        { c: 'eu_monster', name: i18n.t('Avrupa') },
        { c: 'west_china', name: i18n.t('BatiCin') },
        { c: 'minor_asia', name: i18n.t('KucukAsya') },
        { c: 'central_asia', name: i18n.t('OrtaAsya') },
        { c: 'oasis', name: i18n.t('Oasis') },
        { c: 'taklamakan', name: i18n.t('Taklamakan') },
        { c: 'west_asia', name: i18n.t('BatiAsya') },
        { c: 'egpyt_monster', name: i18n.t('Misir') },
        { c: 'china_monster_dungeon', name: i18n.t('CinDungeon') },
        { c: 'egpyt_monster_dungeon', name: i18n.t('MisirDungeon') },
        { c: 'eu_monster_dungeon', name: i18n.t('AvrupaDungeon') },
        { c: 'fgw', name: i18n.t('UnutulmusDunya') },
    ];

    async function getChars() {
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
    }

    async function getMonsters() {
        setMonsters([]);
        setRefreshing(true);
        setDataReceived(false);
        let _activePage = page;
        let _locale = i18n.locale;
        let _level = 0;
        if (_locale.indexOf('-') > 0) {
            _locale = _locale.split('-')[0].toLocaleLowerCase();
        }
        if (activeTab == 0) {
            if (level == 0 && chars.length > 0) {
                setActiveChar(parseInt(chars[0].charId));
                setLevel(chars[0].character.level);
                return;
            }
            else {
                _level = level;
            }
        }
        await fetch('https://api.sromc.com/gamedata/getmonsters',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: _activePage,
                    language: _locale,
                    keyword: keyword,
                    category: categories[activeTab].c,
                    level: _level
                })
            })
            .then((res) => res.json())
            .then((res) => {
                setMonsters(res);
            }).catch(() => {

            });
        setRefreshing(false);
        setDataReceived(true);
    }

    useEffect(() => {
        getChars();
    }, []);

    useEffect(() => {
        getMonsters();
    }, [page, chars, keyword, level, activeTab]);

    function refresh() {
        getChars();
        setKeyword('');
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        /*const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
        */
    };

    function endOfPage() {
        const _page = page + 1;
        setPage(_page);
    }

    return (
        <>
            <View style={styles.border}></View>
            <View style={{ flex: 1 }}>
                <ScrollView
                    /*onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            endOfPage();
                        }
                    }}*/
                    scrollEventThrottle={32}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={refresh}
                            colors={['#fff']}
                            tintColor={'#fff'}
                        />
                    }>
                    <View style={styles.root}>
                        <ImageBackground style={styles.bg} source={require('../images/background.png')} resizeMode={'repeat'} resizeMethod={'scale'}>
                            <View style={styles.search}>
                                <TextInput placeholder={i18n.t('Arayin')} onChangeText={text => setKeyword(text)} value={keyword} autoCorrect={false} keyboardAppearance={'dark'} autoCapitalize={'none'} keyboardType={'default'} placeholderTextColor={'#B7B7B7'} style={styles.searchText} />
                            </View>
                            <View>
                                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                                    <View style={styles.titleRoot}>
                                        {
                                            categories.map((c, i) => {
                                                return (
                                                    <TouchableOpacity key={i} onPress={() => setActiveTab(i)} activeOpacity={0.8}>
                                                        <Text style={activeTab == i ? styles.title : styles.titlePassive}>{c.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                            {
                                activeTab == 0
                                    ?
                                    <View style={{ marginBottom: 20 }}>
                                        <ScrollView horizontal={true}>
                                            {
                                                chars.map((char, i) => {
                                                    return (
                                                        <TouchableOpacity style={activeChar == char.charId ? styles.miniCharActive : styles.miniChar} key={char.charId} onPress={() => { setActiveChar(parseInt(char.charId)); setLevel(parseInt(char.character.level)) }}>
                                                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>{char.charName}</Text>
                                                            <Text style={{ fontSize: 12, color: 'black' }}>{char.server}</Text>
                                                            <Text style={{ fontSize: 13, color: 'black' }}>Lvl.{char.character.level}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                    : null
                            }
                            {
                                monsters.map((m, i) => {
                                    return <Monster key={i}
                                        name={m.name}
                                        level={m.level}
                                        image={m.image}
                                        desc={m.desc}
                                        attackType={m.attackType}
                                        defenceType={m.defenceType}
                                        attackMethod={m.attackMethod}
                                        playerLevel={activeTab == 0 ? level : 0}
                                    />
                                })
                            }


                            {
                                monsters.length == 0 && dataReceived ?
                                    <>
                                        <NoContent title={i18n.t('Bulunamadi')} />
                                    </>
                                    : null
                            }

                            {
                                refreshing ?
                                    <View style={{ marginTop: 15, marginBottom: 15 }}>
                                        <ActivityIndicator size={'large'} color={'#fff'} />
                                    </View>
                                    : null
                            }

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
    localeTitle: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 25
    },
    search: {
        backgroundColor: '#653A25',
        padding: 5,
        borderRadius: 20,
        marginBottom: 15
    },
    searchText: {
        color: 'white',
        textAlign: 'center',
        height: 30,
        padding: 0,
        fontSize: 20
    },
    titleRoot: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginRight: 15
    },
    titlePassive: {
        color: '#A57056',
        fontWeight: 'bold',
        fontSize: 17,
        marginRight: 15
    },
    miniChar: {
        display: 'flex',
        backgroundColor: '#A57056',
        borderRadius: 4,
        marginRight: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: '#A57056',
        width: 110
    },
    miniCharActive: {
        display: 'flex',
        backgroundColor: '#653A25',
        borderRadius: 4,
        marginRight: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: '#A57056',
        minWidth: 110,
    }
});