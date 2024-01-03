import i18n from 'i18n-js';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NoContent from '../../components/blocks/NoContent';
import Player from '../../components/blocks/Player';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import ButtonRegular from '../../components/ButtonRegular';
import Divider from '../../components/Divider';
import Percentage from '../../components/Percentage';
import { jsonConvert, normalizeJson, stringToByte } from '../../src/helpers';

export default function Guild({ guild, union, charId }) {

    const [activeTab, setActiveTab] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [players, setPlayers] = useState([]);
    const [playersUnion, setPlayersUnion] = useState([]);
    const [invitePlayerName, setInvitePlayerName] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [kickPlayerName, setKickPlayerName] = useState('');
    const [kickMessage, setKickMessage] = useState('');
    const [commandSent, setCommandSent] = useState(false);

    function guildMemberType(authority) {
        if (authority == 4294967295) {
            return i18n.t('Baskan');
        }
        return i18n.t('Uye');
    }

    async function sendCommand(command) {
        let Arg1 = '';
        let Arg2 = '';
        let Arg3 = '';

        if (command == 'guild_invite') {
            Arg1 = invitePlayerName;
            Arg2 = inviteMessage;
            if (Arg1.length == 0) {
                return false;
            }
            if (Arg2.length == 0) {
                Arg2 = 'Guild Invite';
            }
        }
        else if (command == 'guild_kick') {
            Arg1 = kickPlayerName;
            Arg2 = kickMessage;
            if (Arg1.length == 0) {
                return false;
            }
            if (Arg2.length == 0) {
                Arg2 = 'Guild Kick';
            }
        }

        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/tasks/create',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Token: token,
                    CharId: charId,
                    Command: command,
                    Arg1: Arg1,
                    Arg2: Arg2,
                    Arg3: Arg3
                })
            })
            .then((res) => res.json())
            .then((res) => {
                setCommandSent(true);
                setInvitePlayerName('');
                setKickPlayerName('');
                setInviteMessage('');
                setKickMessage('')
            }).catch(() => {
            });
    }

    useEffect(() => {
        if (guild != null && union != null) {

            // Guild
            const players = jsonConvert(normalizeJson(guild));
            const playersArray = [];
            for (const [key, value] of Object.entries(players)) {
                const _name = value.name;
                const _level = value.level;
                const _gp = value.donated_gp;
                const _online = value.online;
                const _authority = value.authority;
                const _model = value.model;
                playersArray.push({ model: _model, name: _name, level: _level, gp: _gp, online: _online, authority: _authority });
            }
            setPlayers(playersArray);

            // Union
            const players2 = jsonConvert(normalizeJson(union));
            const playersArray2 = [];
            for (const [key, value] of Object.entries(players2)) {
                const _name = value.name;
                const _level = value.level;
                const _count = value.count;
                const _master = value.master;
                playersArray2.push({ name: _name, level: _level, count: _count, master: _master });
            }
            setPlayersUnion(playersArray2);
        }
    }, [guild, union])


    useEffect(() => {
        let timer;
        if (commandSent) {
            timer = setTimeout(() => {
                setCommandSent(false);
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [commandSent]);


    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={commandSent}>
                <View style={styles.commandSent}>
                    <Image style={{ width: 81, height: 81, marginBottom: 20 }} source={require('../../images/check.png')} />
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>{i18n.t('KomutGonderildi')}</Text>
                    <Text style={{ fontWeight: '300', marginTop: 5, color: '#ccc', width: '90%', textAlign: 'center' }}>{i18n.t('KomutGonderildiAciklama')}.</Text>
                </View>
            </Modal>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>Guild</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(3)} activeOpacity={0.8}>
                            <Text style={activeTab == 3 ? styles.title : styles.titlePassive}>{i18n.t('GuildAyarlari')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(2)} activeOpacity={0.8}>
                            <Text style={activeTab == 2 ? styles.title : styles.titlePassive}>Union</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {
                activeTab == 1 ?
                    <View>

                        {
                            players.length == 0 ?
                                <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('GuildYok')} />
                                : null
                        }

                        {
                            players.slice((activePage - 1) * 10, activePage * 10).map((player, i) => {
                                return (
                                    <Player
                                        key={i}
                                        charName={player.name}
                                        secondaryName={player.gp + ' GP'}
                                        level={player.level}
                                        model={player.model}
                                        arg1={<Text style={{ color: '#A57056', fontSize: 13, textAlign: 'right' }}>{guildMemberType(player.authority)}</Text>}
                                        arg3={
                                            player.online == 1 ?
                                                <Text style={{ color: '#3ABA13', fontSize: 13, textAlign: 'right' }}>{i18n.t('Online')}</Text>
                                                :
                                                <Text style={{ color: '#D34A4A', fontSize: 13, textAlign: 'right' }}>{i18n.t('Offline')}</Text>
                                        }
                                    />
                                )
                            })
                        }

                        {
                            players.length > 10 ?
                                <View style={styles.pagination}>
                                    {
                                        Array.from(Array(Math.ceil(players.length / 10)).keys()).map((page, i) => {
                                            return (
                                                <TouchableOpacity key={i} style={activePage == (i + 1) ? styles.activePage : styles.page} onPress={() => setActivePage(i + 1)}>
                                                    <Text style={activePage == (i + 1) ? { fontWeight: 'bold', color: '#fff' } : { fontWeight: 'bold' }}>{i + 1}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                                : null
                        }

                    </View>
                    : null
            }

            {
                activeTab == 2 ?
                    <View>

                        {
                            playersUnion.length == 0 ?
                                <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('GuildYok')} />
                                : null
                        }

                        {
                            playersUnion.map((player, i) => {
                                return (
                                    <Player
                                        key={i}
                                        hideCharImage={true}
                                        charName={player.name}
                                        secondaryName={i18n.t('Baskan') + ': ' + player.master}
                                        level={player.level}
                                        arg3={<Text style={{ color: '#A57056', fontSize: 13 }}>{player.count + ' ' + i18n.t('Uye')}</Text>}
                                    />
                                )
                            })
                        }
                    </View>
                    : null
            }

            {
                activeTab == 3 && players.length > 0 ?
                    <View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('DavetEt')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setInvitePlayerName(text)} value={invitePlayerName} placeholder={i18n.t('OyuncuAdi')} placeholderTextColor={'#A57056'} keyboardAppearance={'dark'} style={styles.input} />
                            </View>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setInviteMessage(text)} value={inviteMessage} placeholder={i18n.t('Mesaj')} placeholderTextColor={'#A57056'} keyboardAppearance={'dark'} style={styles.input} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <ButtonRegular onPress={() => sendCommand('guild_invite')} title={i18n.t('DavetEt')} />
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('GuilddenAt')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setKickPlayerName(text)} value={kickPlayerName} placeholder={i18n.t('OyuncuAdi')} placeholderTextColor={'#A57056'} keyboardAppearance={'dark'} style={styles.input} />
                            </View>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setKickMessage(text)} value={kickMessage} placeholder={i18n.t('Mesaj')} placeholderTextColor={'#A57056'} keyboardAppearance={'dark'} style={styles.input} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <ButtonRegular onPress={() => sendCommand('guild_kick')} title={i18n.t('At')} />
                            </View>
                        </View>
                    </View>
                    : null
            }

        </>
    )
}

const styles = StyleSheet.create({
    titleRoot: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginRight: 15
    },
    titleSub: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginRight: 15,
        marginTop: 30,
        marginBottom: 10
    },
    titlePassive: {
        color: '#A57056',
        fontWeight: 'bold',
        fontSize: 17,
        marginRight: 15
    },
    commandV: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'space-between',
        borderColor: '#653A25',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15
    },
    label: {
        color: '#ccc',
        fontSize: 14
    },
    commandSent: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#653A25',
        padding: 15,
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20
    },
    actionsV: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8
    },
    input: {
        backgroundColor: 'transparent',
        flexGrow: 1,
        borderColor: '#653A25',
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 10,
        height: 30,
        paddingRight: 5,
        marginRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        color: '#fff'
    },
    pagination: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activePage: {
        backgroundColor: '#A57056',
        padding: 10,
        borderRadius: 5,
        marginRight: 4
    },
    page: {
        backgroundColor: '#653A25',
        padding: 10,
        borderRadius: 5,
        marginRight: 4
    }
});