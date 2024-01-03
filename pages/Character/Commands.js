import React, { useState, useEffect, useRef } from 'react';
import { Text, Modal, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import Command from '../../components/blocks/Command';
import AsyncStorage from '@react-native-community/async-storage'
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import ButtonRegular from '../../components/ButtonRegular';
import Divider from '../../components/Divider';
import i18n from 'i18n-js';
import LoaderPage from '../../components/blocks/LoaderPage';
import { jsonConvert, normalizeJson } from '../../src/helpers';

export default function Commands({ detail, inventory, charId, status, party, charName }) {

    const [activeTab, setActiveTab] = useState(1);
    const [commandSent, setCommandSent] = useState(false);
    const [trainingRadius, setTrainingRadius] = useState(0);
    const [trainingX, setTrainingX] = useState(0);
    const [trainingY, setTrainingY] = useState(0);
    const [trainingZ, setTrainingZ] = useState(0);
    const [tracePlayerName, setTracePlayerName] = useState('');
    const [moveX, setMoveX] = useState(0);
    const [moveY, setMoveY] = useState(0);
    const [globalMessage, setGlobalMessage] = useState('');
    const [globalTickets, setGlobalTickets] = useState(0);
    const [script, setScript] = useState('');
    const [partyPlayers, setPartyPlayers] = useState([]);
    const [selectedPartyPlayer, setSelectedPartyPlayer] = useState('');

    async function sendCommand(command) {

        let Arg1 = '';
        let Arg2 = '';
        let Arg3 = '';

        if (command == 'set_training_radius') {
            let value = trainingRadius;
            if (value == 0) {
                value = parseInt(detail.trainingArea.radius);
            }
            Arg1 = value.toString();
        }
        else if (command == 'set_training_position') {
            let _x = parseInt(trainingX);
            let _y = parseInt(trainingY);
            let _z = parseInt(trainingZ);

            if (_x == 0) {
                _x = parseInt(detail.trainingArea.x);
            }

            if (_y == 0) {
                _y = parseInt(detail.trainingArea.y);
            }

            if (_z == 0) {
                _z = parseInt(detail.trainingArea.z);
            }

            Arg1 = _x.toString();
            Arg2 = _y.toString();
            Arg3 = _z.toString();
        }
        else if (command == 'start_trace') {
            let value = tracePlayerName;
            Arg1 = value.toString();
        }
        else if (command == 'move_to') {
            let _x = parseInt(moveX);
            let _y = parseInt(moveY);

            Arg1 = _x.toString();
            Arg2 = _y.toString();
        }
        else if (command == 'send_global') {
            let message = globalMessage;
            if (message.length <= 1) {
                return false;
            }

            Arg1 = message.toString();
        }
        else if (command == 'start_script') {
            let _script = script;
            if (_script.length <= 10) {
                return false;
            }

            Arg1 = _script.toString();
        }
        else if (command == 'reverse_return_dead') {
            command = 'reverse_return';
            Arg1 = "0";
        }
        else if (command == 'reverse_return_last') {
            command = 'reverse_return';
            Arg1 = "1";
        }
        else if (command == 'reverse_return_party') {
            command = 'reverse_return';
            Arg1 = "2";
            Arg2 = selectedPartyPlayer.toString();
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
                setGlobalMessage('');
                setSelectedPartyPlayer('');
            }).catch(() => {
            });
    }

    function sendGlobalMessageApprove() {
        Alert.alert(
            i18n.t('GlobalMesajGonder'),
            i18n.t('MesajOnayla'),
            [
                {
                    text: i18n.t('Vazgec'),
                    style: "danger",
                },
                {
                    text: i18n.t('Gonder'),
                    style: "destructive",
                    onPress: () => sendCommand('send_global'),
                },
            ],
            {
                cancelable: true
            })
    }

    function disconnectFromGame() {
        Alert.alert(
            i18n.t('OyunBaglantisiniKes'),
            i18n.t('OyunBaglantisiniKesAciklama'),
            [
                {
                    text: i18n.t('Vazgec'),
                    style: "danger",
                },
                {
                    text: i18n.t('Kes'),
                    style: "destructive",
                    onPress: () => sendCommand('disconnect'),
                },
            ],
            {
                cancelable: true
            })
    }

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

    useEffect(() => {
        // Party players
        const players = jsonConvert(normalizeJson(party));
        const playersArray = [];
        for (const [key, value] of Object.entries(players)) {
            const _name = value.name;
            const _level = value.level;
            const _guild = value.guild;
            const _hp = value.hp_percent * 10;
            const _mp = value.mp_percent * 10;

            if (_name != charName) {
                playersArray.push({ name: _name, level: _level, guild: _guild, hp: _hp, mp: _mp });
            }
        }
        setPartyPlayers(playersArray);

        // Inventory
        const _inventory = jsonConvert(normalizeJson(inventory, true)).items;
        const _globalMessageTickets = _inventory.filter(a => a.servername == 'ITEM_MALL_GLOBAL_CHATTING');
        let totalTickets = 0;
        for (let i = 0; i < _globalMessageTickets.length; i++) {
            totalTickets += parseInt(_globalMessageTickets[i].quantity);
        }
        setGlobalTickets(totalTickets);
    }, [detail])



    if (detail == null) {
        return (
            <>
                <LoaderPage />
            </>
        )
    }

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
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Komutlar')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {
                activeTab == 1 ?
                    <View>
                        <View style={styles.commandH}>
                            <Text style={styles.labelFill}>{i18n.t('BotDurumu')}</Text>
                            {
                                status == 'botting' ?
                                    <>
                                        <Text style={styles.success}>{i18n.t('Calisiyor')}</Text>
                                        <ButtonRegular onPress={() => sendCommand('stop_bot')} title={i18n.t('Durdur')} />
                                    </>
                                    :
                                    <>
                                        <Text style={styles.error}>{i18n.t('Calismiyor')}</Text>
                                        <ButtonRegular onPress={() => sendCommand('start_bot')} title={i18n.t('Baslat')} />
                                    </>
                            }

                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('KasilmaAlaniBuyuklugu')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setTrainingRadius(text)} defaultValue={parseInt(detail.trainingArea.radius).toLocaleString()} keyboardAppearance={'dark'} maxLength={5} keyboardType={'numeric'} style={styles.input} />
                                <ButtonRegular onPress={() => sendCommand('set_training_radius')} title={i18n.t('Ayarla')} />
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('KasilmaAlanPozisyonu')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setTrainingX(text)} defaultValue={parseInt(detail.trainingArea.x).toString()} keyboardAppearance={'dark'} autoCorrect={false} keyboardType={'numbers-and-punctuation'} maxLength={6} placeholder='X' placeholderTextColor={'#A57056'} style={styles.input} />
                                <TextInput onChangeText={text => setTrainingY(text)} defaultValue={parseInt(detail.trainingArea.y).toString()} keyboardAppearance={'dark'} autoCorrect={false} keyboardType={'numbers-and-punctuation'} maxLength={6} placeholder='Y' placeholderTextColor={'#A57056'} style={styles.input} />
                                <TextInput onChangeText={text => setTrainingZ(text)} defaultValue={parseInt(detail.trainingArea.z).toString()} keyboardAppearance={'dark'} autoCorrect={false} keyboardType={'numbers-and-punctuation'} maxLength={6} placeholder='Z' placeholderTextColor={'#A57056'} style={styles.input} />
                                <ButtonRegular onPress={() => sendCommand('set_training_position')} title={i18n.t('Ayarla')} />
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('OyuncuyuTakipEt')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setTracePlayerName(text)} value={tracePlayerName} keyboardAppearance={'dark'} placeholder={i18n.t('OyuncuAdi')} placeholderTextColor={'#A57056'} style={styles.input} />
                                <ButtonRegular onPress={() => sendCommand('start_trace')} title={i18n.t('Takip')} />
                            </View>
                        </View>
                        <View style={styles.commandH}>
                            <Text style={styles.label}>{i18n.t('OyuncuTakibiniBirak')}</Text>
                            <ButtonRegular onPress={() => sendCommand('stop_trace')} title={i18n.t('Birak')} />
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('HareketEt')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setMoveX(text)} keyboardAppearance={'dark'} autoCorrect={false} keyboardType={'numbers-and-punctuation'} maxLength={6} placeholder='X' placeholderTextColor={'#A57056'} style={styles.input} />
                                <TextInput onChangeText={text => setMoveY(text)} keyboardAppearance={'dark'} autoCorrect={false} keyboardType={'numbers-and-punctuation'} maxLength={6} placeholder='Y' placeholderTextColor={'#A57056'} style={styles.input} />
                                <ButtonRegular onPress={() => sendCommand('move_to')} title={i18n.t('Git')} />
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('GlobalMesajGonder')} ({globalTickets})</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setGlobalMessage(text)} value={globalMessage} keyboardAppearance={'dark'} autoCapitalize={'none'} autoComplete={'off'} autoCorrect={false} multiline={true} placeholder={i18n.t('MesajYazin')} placeholderTextColor={'#A57056'} style={styles.inputArea} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <ButtonRegular onPress={() => sendGlobalMessageApprove()} title={i18n.t('Gonder')} />
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('ReverseKulan')}</Text>
                            <View style={styles.actionsV}>
                                <View style={styles.actionVholder}>
                                    <ButtonRegular onPress={() => sendCommand('reverse_return_dead')} title={i18n.t('SonOlunenYer')} />
                                </View>
                                <View style={styles.actionVholder}>
                                    <ButtonRegular onPress={() => sendCommand('reverse_return_last')} title={i18n.t('SonKullanilanYer')} />
                                </View>
                                {
                                    partyPlayers.length > 1 ?
                                        <View style={styles.players}>
                                            {
                                                partyPlayers.map((player, i) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => setSelectedPartyPlayer(player.name)} style={styles.selectPlayer}>
                                                            <Text style={selectedPartyPlayer == player.name ? { color: 'yellow' } : { color: '#999' }} >{player.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                        : null
                                }
                                {
                                    partyPlayers.length > 1 ?
                                        <View style={styles.actionVholder}>
                                            <ButtonRegular disabled={selectedPartyPlayer == ''} onPress={() => sendCommand('reverse_return_party')} title={i18n.t('PartiUyesiYanina')} />
                                        </View>
                                        : null
                                }
                            </View>
                        </View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('ScriptAyarlaveBaslat')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput onChangeText={text => setScript(text)} value={script} keyboardAppearance={'dark'} autoCapitalize={'none'} autoComplete={'off'} autoCorrect={false} multiline={true} placeholder={'walk,6434,1094,-32 \n walk,6435,1087,-32 \n walk,6435,1026,-32'} placeholderTextColor={'#A57056'} style={styles.inputArea} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <ButtonRegular onPress={() => sendCommand('start_script')} title={i18n.t('Baslat')} />
                            </View>
                        </View>
                        <View style={styles.commandH}>
                            <Text style={styles.label}>{i18n.t('ScriptDurdur')}</Text>
                            <ButtonRegular onPress={() => sendCommand('stop_script')} title={i18n.t('Durdur')} />
                        </View>
                        <View style={styles.commandH}>
                            <Text style={styles.label}>{i18n.t('OyunBaglantisiniKes')}</Text>
                            <ButtonRegular onPress={() => disconnectFromGame()} title={i18n.t('Kes')} isDanger={true} />
                        </View>
                    </View>
                    : null
            }

            {
                activeTab == 2 ?
                    <View>
                        <View style={styles.commandV}>
                            <Text style={styles.label}>{i18n.t('KasilmaAlaniBuyuklugu')}</Text>
                            <View style={styles.actionsV}>
                                <TextInput keyboardAppearance={'dark'} maxLength={5} keyboardType={'numeric'} style={styles.input} />
                                <ButtonRegular onPress={() => sendCommand('bot_stop')} title={i18n.t('Ayarla')} />
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
    commandH: {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderColor: '#653A25',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15
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
    label: {
        color: '#ccc',
        fontSize: 14
    },
    labelFill: {
        color: '#ccc',
        fontSize: 14,
        flexGrow: 1
    },
    success: {
        color: '#3ABA13',
        fontSize: 14,
        marginRight: 10,
        fontWeight: 'bold'
    },
    error: {
        color: '#D34A4A',
        fontSize: 14,
        marginRight: 10,
        fontWeight: 'bold'
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
    inputArea: {
        backgroundColor: 'transparent',
        flexGrow: 1,
        borderColor: '#653A25',
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 5,
        marginRight: 5,
        paddingTop: 3,
        paddingBottom: 3,
        color: '#fff'
    },
    actionsV: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8
    },
    actionVholder: {
        width: '100%',
        marginBottom: 5
    },
    players: {
        backgroundColor: '#653A25',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        borderRadius: 10,
        padding: 5,
        marginBottom: 4,
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    selectPlayer: {
        marginRight: 5,
        padding: 5
    }
});