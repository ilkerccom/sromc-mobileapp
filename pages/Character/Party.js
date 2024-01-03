import i18n from 'i18n-js';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NoContent from '../../components/blocks/NoContent';
import Player from '../../components/blocks/Player';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import ButtonSecondary from '../../components/ButtonSecondary';
import Divider from '../../components/Divider';
import Percentage from '../../components/Percentage';
import { jsonConvert, normalizeJson } from '../../src/helpers';

export default function Party({ detail, charId }) {

    const [activeTab, setActiveTab] = useState(1);
    const [partyPlayers, setPartyPlayers] = useState([]);
    const [taxiPlayers, setTaxiPlayers] = useState([]);
    const [leavingParty, setLeavingParty] = useState(false);

    function taxiTime(remaining) {
        if (remaining > 60) {
            const minutes = (remaining / 60);
            if (minutes > 60) {
                const hours = minutes / 60;
                return parseInt(hours) + ' ' + i18n.t('Saat');
            }
            return parseInt(minutes) + ' ' + i18n.t('Dakika');
        }
        else {
            return parseInt(remaining / 60) + ' ' + i18n.t('Saniye');
        }
    }

    async function leaveParty() {
        setLeavingParty(true);
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
                    Command: "leave_party",
                    Arg1: '',
                    Arg2: '',
                    Arg3: ''
                })
            })
            .then((res) => res.json())
            .then((res) => {
                if (_player == '') {
                    setMessageToPM('');
                }
                setMessageSent(true);
                setLeavingParty(false);
            }).catch(() => {
            });
    }

    useEffect(() => {
        if (detail != null) {
            if (activeTab == 1) {
                const players = jsonConvert(normalizeJson(detail));
                const playersArray = [];
                for (const [key, value] of Object.entries(players)) {
                    const _name = value.name;
                    const _level = value.level;
                    const _guild = value.guild;
                    const _hp = value.hp_percent * 10;
                    const _mp = value.mp_percent * 10;
                    playersArray.push({ name: _name, level: _level, guild: _guild, hp: _hp, mp: _mp });
                }
                setPartyPlayers(playersArray);
            }
            /*else if (activeTab == 2) {
                const players = jsonConvert(normalizeJson(detail.party));
                const playersArray = [];
                for (const [key, value] of Object.entries(players)) {
                    const _name = value.name;
                    const _level = value.level;
                    const _guild = value.guild;
                    const _hp = value.hp_percent * 10;
                    const _mp = value.mp_percent * 10;
                    playersArray.push({ name: _name, level: _level, guild: _guild, hp: _hp, mp: _mp });
                }
                setPartyPlayers(playersArray);
            }*/
        }
    }, [detail])


    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Parti')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(2)} activeOpacity={0.8}>
                            <Text style={activeTab == 2 ? styles.title : styles.titlePassive}>{i18n.t('Taksi')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {
                activeTab == 1 ?

                    <View>
                        {
                            partyPlayers.length == 0 ?
                                <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('PartiBulunamadi')} />
                                : null
                        }

                        {
                            partyPlayers.map((player, i) => {
                                return (
                                    <Player
                                        key={i}
                                        charName={player.name}
                                        secondaryName={player.guild}
                                        showFlag={i == 0}
                                        level={player.level}
                                        arg1={<Text style={{ color: '#A57056', fontSize: 13, textAlign: 'right' }}>{player.hp}/{player.mp}</Text>}
                                        arg2={<Percentage perc={player.hp} color={'#D34A4A'} />}
                                        arg3={<Percentage perc={player.mp} color={'#2D76BF'} />}
                                    />
                                )
                            })
                        }

                        {
                            partyPlayers.length > 0 ?
                                <ButtonSecondary loading={leavingParty} onPress={leaveParty} title={i18n.t('PartidenAyril')} />
                                :
                                null
                        }

                    </View>
                    : null
            }
            {
                activeTab == 2 ?
                    <View>
                        {
                            taxiPlayers.length == 0 ?
                                <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('PartiBulunamadi')} />
                                : null
                        }

                        {
                            taxiPlayers.map((player, i) => {
                                return (
                                    <Player
                                        charName={'Noozs'}
                                        secondaryName={taxiTime(54055)}
                                        level={23}
                                        hideCharImage={true}
                                        arg1={<Text style={{ color: '#A57056', fontSize: 13 }}>XY: -2323, 3223</Text>}
                                        arg3={<Text style={{ color: '#A57056', fontSize: 13, textAlign: 'right' }}>{i18n.t('Hayatta')}</Text>}
                                    />
                                )
                            })
                        }
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
    }
});