import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import NoContent from '../../components/blocks/NoContent';
import Player from '../../components/blocks/Player';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import Divider from '../../components/Divider';
import Percentage from '../../components/Percentage';
import { jsonConvert, normalizeJson } from '../../src/helpers';

export default function Academy({ detail }) {

    const [activeTab, setActiveTab] = useState(1);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (detail != null) {
            const players = jsonConvert(normalizeJson(detail));
            if (Object.entries(players).length > 0) {
                let playerList = [];
                for (const [key, value] of Object.entries(players)) {
                    let _player = {};
                    for (const [key2, value2] of Object.entries(value)) {
                        if (key2 == "name") {
                            _player.name = value2;
                        }
                        else if (key2 == "level") {
                            _player.level = value2;
                        }
                        else if (key2 == "online") {
                            _player.online = value2;
                        }
                        else if (key2 == "type") {
                            _player.type = value2;
                        }
                        else if (key2 == "x") {
                            _player.x = value2;
                        }
                        else if (key2 == "y") {
                            _player.y = value2;
                        }
                    }
                    if (_player.name != null) {

                        playerList.push(_player);
                    }
                }
                setPlayers(playerList);
            }
        }
    }, [detail])


    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Akademi')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View>
                {
                    players.length == 0 ?
                        <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('AkademiYok')} />
                        : null
                }
                {
                    players.map((player, i) => {
                        return (
                            <Player
                                key={i}
                                charName={player.name}
                                secondaryName={player.type == 0 ? 'Master' : null}
                                level={player.level}
                                arg3={
                                    player.online == 1 ?
                                        <Text style={{ color: '#3ABA13', fontSize: 13 }}>{i18n.t('Online')}</Text>
                                        :
                                        <Text style={{ color: '#D34A4A', fontSize: 13 }}>{i18n.t('Offline')}</Text>
                                }
                            />)
                    })
                }
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
    }
});