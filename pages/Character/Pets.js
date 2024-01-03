import i18n from 'i18n-js';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import NoContent from '../../components/blocks/NoContent';
import Pet from '../../components/blocks/Pet';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import Divider from '../../components/Divider';
import { jsonConvert, normalizeJson } from '../../src/helpers';

export default function Pets({ pets }) {

    const [activeTab, setActiveTab] = useState(1);
    const [myPets, setMyPets] = useState([]);

    useEffect(() => {
        if (pets != null) {
            const _pets = jsonConvert(normalizeJson(pets));
            const petsArray = [];
            for (const [key, value] of Object.entries(_pets)) {
                const _name = value.name;
                const _type = value.type;
                const _mounted = value.mounted;
                const _hp = value.hp
                const _servername = value.servername;
                petsArray.push({ name: _name, servername: _servername, type: _type, mounted: _mounted, hp: _hp });
            }
            setMyPets(petsArray);
        }
    }, [pets])


    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Petler')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <View>

                {
                    myPets.length == 0 ?
                    <NoContent title={i18n.t('PetYok')} desc={i18n.t('AktifPetYok')} />
                    : null
                }

                {
                    myPets.map((pet, i) => {
                        return (
                            <Pet key={i} name={pet.name} servername={pet.servername} isActive={true} type={pet.type} hp={pet.hp} />
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