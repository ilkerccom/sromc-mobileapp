import I18n from 'i18n-js';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function Monster({ name, level, image, desc, attackType, defenceType, attackMethod, playerLevel }) {

    const [showDesc, setShowDesc] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    let monsterLevelStyle = styles.normal;
    if (playerLevel != 0) {
        if (playerLevel < level) {
            monsterLevelStyle = styles.high;
        }
        else if ((playerLevel - level) > 0 && (playerLevel - level) <= 3) {
            monsterLevelStyle = styles.moderate;
        }
        else if ((playerLevel - level) > 2) {
            monsterLevelStyle = styles.low;
        }
    }

    return (
        <TouchableOpacity onPress={() => setShowDesc(!showDesc)} style={styles.root}>
            <View style={styles.main}>
                <View>
                    <Image onLoad={() => setImageLoaded(true)} style={styles.image} source={imageLoaded ? { uri: 'https://sromc.com/_monsters/' + image } : require('../../images/nocontent.png')} />
                </View>
                <View style={styles.right}>
                    <View style={styles.nameView}>
                        <Text style={[styles.name, monsterLevelStyle]}>{name}</Text>
                        <View style={styles.levelView}>
                            {
                                level >= 1 ?
                                    <>
                                        <Text style={styles.level}>Level {level}</Text>
                                        <Text style={{ marginLeft: 10, marginRight: 10, color: '#ccc' }}>|</Text>
                                    </>
                                    : null
                            }
                            <Text style={styles.typeAttack}></Text>
                            {attackType == 'Non-preemptive' ?
                                <Text style={styles.typeAttackPassive}>{I18n.t('Pasif')}</Text>
                                :
                                <Text style={styles.typeAttack}>{I18n.t('Saldirgan')}</Text>
                            }
                        </View>
                        <Text style={styles.type}>
                            {attackMethod == 'Magic' ? I18n.t('BuyuSaldirisi') : null}
                            {attackMethod == 'Melee' ? I18n.t('FizikselSaldiri') : null}
                            {attackMethod == 'Melee/Magic' ? I18n.t('BuyuveFizikselSaldiri') : null}
                        </Text>
                        <Text style={styles.type}>
                            {defenceType == 'General' ? I18n.t('BuyuveFizikselDefans') : null}
                            {defenceType == 'Magic defense' ? I18n.t('BuyuDefansi') : null}
                            {defenceType == 'Melee Defense' ? I18n.t('FizikselDefans') : null}
                        </Text>
                    </View>
                </View>
            </View>
            {
                showDesc ?
                    <View style={styles.desc}>
                        <Text style={styles.descText}>
                            {desc}
                        </Text>
                    </View>
                    : null}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#653A25',
        borderRadius: 10,
        padding: 10,
        marginBottom: 5
    },
    main: {
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        width: 85,
        height: 85,
        borderRadius: 10
    },
    right: {
        marginLeft: 10
    },
    nameView: {

    },
    name: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16
    },
    low: {
        color: '#48a9ba',
    },
    moderate: {
        color: '#54bc98',
    },
    normal: {
        color: '#fff',
    },
    high: {
        color: '#f22507',
    },
    level: {
        color: 'orange',
        fontWeight: 'bold'
    },
    type: {
        color: '#ccc',
        marginBottom: 5,
        fontSize: 13
    },
    typeAttack: {
        color: 'yellow'
    },
    typeAttackPassive: {
        color: '#ccc'
    },
    levelView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5
    },
    desc: {
        borderTopWidth: 1,
        borderTopColor: '#BE8B56',
        paddingTop: 10,
        marginTop: 10
    },
    descText: {
        color: '#fff',
        fontSize: 13
    }
});