import i18n from 'i18n-js';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import NoContent from '../../components/blocks/NoContent';
import Quest from '../../components/blocks/Quest';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import Divider from '../../components/Divider';
import { jsonConvert, normalizeJson } from '../../src/helpers';

export default function Quests({ questsData }) {

    const [activeTab, setActiveTab] = useState(1);
    const [quests, setQuests] = useState([]);

    useEffect(() => {
        if (questsData != null) {
            const _quests = jsonConvert(normalizeJson(questsData));
            const questArray = [];
            for (const [key, value] of Object.entries(_quests)) {
                const _name = value.name;
                const _completed = value.completed;
                const _objectives_completed = value.objectives_completed
                questArray.push({ name: _name, completed: _completed, objectives_completed: _objectives_completed });
            }
            setQuests(questArray);
        }
    }, [questsData])


    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Gorevler')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View>

                {
                    quests.length == 0 ?
                        <NoContent title={i18n.t('GorevYok')} desc={i18n.t('AktifGorevYok')} />
                        : null
                }

                {
                    quests.map((quest, i) => {
                        return (
                            <Quest
                                key={i}
                                name={quest.name}
                                completed={quest.objectives_completed} />
                        )
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