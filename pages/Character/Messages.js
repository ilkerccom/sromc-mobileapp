import i18n from 'i18n-js';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LoaderPage from '../../components/blocks/LoaderPage';
import Message from '../../components/blocks/Message';
import NoContent from '../../components/blocks/NoContent';
import { jsonConvert, replaceMessage, messageResolver, pmToFromResolver } from '../../src/helpers';

export default function Messages({ detail, charId, charName, scrollToTop }) {

    const messageRef = useRef();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [messageToPM, setMessageToPM] = useState('');
    const [messageToPMActive, setMessageToPMActive] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    function toUser(username) {
        let _username = username;
        _username = _username.replace('(TO)', '');
        try {
            _username = _username.replace(/ /g, '');
        }
        catch {
            _username = _username.replace(' ', '');
        }
        if (charName != _username) {
            scrollToTop();
            setMessageToPMActive(true);
            messageRef.current?.focus();
            setMessageToPM(_username);
        }
    }

    function getTargetMessageType() {
        if (messageToPM.length != 0) {
            return "private"
        }
        else if (activeTab == 2) {
            return "party";
        }
        else if (activeTab == 3) {
            return "guild";
        }
        else if (activeTab == 4) {
            return "union";
        }
        else if (activeTab == 5) {
            return "global";
        }
        else if (messageToPM != "") {
            return "private";
        }
        else {
            return "all";
        }
    }

    async function sendMessage() {
        const token = await AsyncStorage.getItem('accessToken');
        const _message = message.trim();
        const _to = getTargetMessageType();
        const _player = messageToPM.length <= 1 ? '' : messageToPM;

        if (_to == 'global') {
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
                        onPress: () => sendMessageAction(_message, _to, _player, token),
                    },
                ],
                {
                    cancelable: true
                })
        }
        else {
            sendMessageAction(_message, _to, _player, token);
        }
    }

    async function sendMessageAction(_message, _to, _player, token) {

        if (_message.length == 0) {
            return false;
        }

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
                    Command: "send_message",
                    Arg1: _message,
                    Arg2: _to,
                    Arg3: _player
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (_player == '') {
                    setMessageToPM('');
                }
                setMessageSent(true);
            }).catch(() => {
            });
        setMessage('');
    }

    function filterMessages(json) {
        if (activeTab == 2) {
            return json.filter(e => e.type == 'party');
        }
        else if (activeTab == 3) {
            return json.filter(e => e.type == 'guild');
        }
        else if (activeTab == 4) {
            return json.filter(e => e.type == 'union');
        }
        else if (activeTab == 5) {
            return json.filter(e => e.type == 'global');
        }
        else if (activeTab == 6) {
            return json.filter(e => e.type == 'stall');
        }
        else if (activeTab == 7) {
            return json.filter(e => e.type == 'notice');
        }
        else if (activeTab == 8) {
            return json.filter(e => e.type == 'private');
        }
        else {
            return json.filter(e => e.type != 'notice');;
        }
    }

    useEffect(() => {
        setMessageSent(false);
    }, [detail]);

    useEffect(() => {
        if (activeTab == 8) {
            setMessageToPMActive(true);
        }
        else {
            if (messageToPM == '') {
                setMessageToPMActive(false);
            }
        }
    }, [activeTab]);


    if (detail == null) {
        return (
            <>
                <LoaderPage />
            </>
        )
    }

    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Tumu')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(8)} activeOpacity={0.8}>
                            <Text style={activeTab == 8 ? styles.title : styles.titlePassive}>PM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(2)} activeOpacity={0.8}>
                            <Text style={activeTab == 2 ? styles.title : styles.titlePassive}>{i18n.t('Parti')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(3)} activeOpacity={0.8}>
                            <Text style={activeTab == 3 ? styles.title : styles.titlePassive}>Guild</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(4)} activeOpacity={0.8}>
                            <Text style={activeTab == 4 ? styles.title : styles.titlePassive}>Union</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(5)} activeOpacity={0.8}>
                            <Text style={activeTab == 5 ? styles.title : styles.titlePassive}>Global</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(6)} activeOpacity={0.8}>
                            <Text style={activeTab == 6 ? styles.title : styles.titlePassive}>{i18n.t('Tezgah')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(7)} activeOpacity={0.8}>
                            <Text style={activeTab == 7 ? styles.title : styles.titlePassive}>{i18n.t('Duyuru')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.writeMessage}>
                    {
                        messageToPM != '' || messageToPMActive ?
                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', alignItems: 'center', borderBottomColor: '#724732', height: 25, borderBottomWidth: 1, marginBottom: 5 }}>
                                <Text style={{ color: '#321507' }}>$</Text>
                                <TextInput autoFocus={messageToPMActive && messageToPM == ''} autoCapitalize={'none'} autoCorrect={false} placeholder={i18n.t('OyuncuAdi')} placeholderTextColor={'#863913'} style={{ color: '#321507', padding: 0 }} onChangeText={text => setMessageToPM(text)} value={messageToPM} />
                                <TouchableOpacity onPress={() => { setMessageToPM(''); setMessageToPMActive(false) }} style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#321507' }}>{i18n.t('Vazgec')}</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                    <TextInput ref={messageRef} onChangeText={text => setMessage(text)} onSubmitEditing={() => sendMessage()} keyboardAppearance={'dark'} value={message} returnKeyType={'send'} style={{ color: '#fff', height: 20, padding: 0 }} placeholderTextColor={'#653A25'} placeholder={i18n.t('MesajYazin')}></TextInput>
                </View>
                <View style={styles.messageRoot}>

                    {
                        filterMessages(jsonConvert(replaceMessage(detail))).length == 0 ?
                            <NoContent title={i18n.t('HenuzMesajYok')} />
                            : null
                    }

                    {
                        messageSent ?
                            <Text style={styles.sent}>{i18n.t('MesajGonderildi')}</Text>
                            : null
                    }

                    {
                        filterMessages(jsonConvert(replaceMessage(detail))).reverse().map((message, i) => {
                            return (
                                <Message
                                    key={i}
                                    toUser={toUser}
                                    from={pmToFromResolver(message.player)}
                                    message={messageResolver(message.message, message.type)}
                                    date={message.date}
                                    type={message.type} />
                            )
                        })
                    }
                </View>
            </View>
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
    writeMessage: {
        backgroundColor: '#A57056',
        borderRadius: 8,
        padding: 15,
        marginBottom: 3
    },
    messageRoot: {
        backgroundColor: '#653A25',
        borderRadius: 8,
        paddingBottom: 10,
        flex: 1,
        flexGrow: 1
    },
    sent: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 10,
        color: '#ccc'
    }
});