import i18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import Divider from '../../components/Divider';
import { calculateHPMPPerc, calculateEXP, normalizeJson, jsonConvert, gameLocal, raceType, yToLat, xToLng, LatToY, LngToX } from '../../src/helpers';
import LoaderPage from '../../components/blocks/LoaderPage';
import MapView, { UrlTile, Marker, Circle } from 'react-native-maps';
import Item from '../../components/blocks/Item';

export default function General({ navigation, charId, detail }) {

    const [activeTab, setActiveTab] = useState(1);
    const [pets, setPets] = useState({});
    const [mapFree, setMapFree] = useState(false);
    const [monstersInArea, setMonstersInArea] = useState([]);
    const [playersInArea, setPlayersInArea] = useState([]);
    const [skills, setSkills] = useState([]);
    const [skillName, setSkillName] = useState('');
    const [drops, setDrops] = useState([]);

    function removeChar() {
        Alert.alert(
            i18n.t('KarakteriSil'),
            i18n.t('KarakteriSilOnay'),
            [
                {
                    text: i18n.t('Vazgec'),
                    style: "danger",
                },
                {
                    text: i18n.t('Sil'),
                    style: "destructive",
                    onPress: () => approveRemove(charId),
                },
            ],
            {
                cancelable: true
            })
    }

    async function approveRemove(charId) {
        const token = await AsyncStorage.getItem('accessToken');
        await fetch('https://api.sromc.com/charinfo/delete',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    charId: charId
                })
            })
            .then((res) => res.json())
            .then((res) => {
                navigation.navigate('Chars', { charDeleted: true })
            }).catch(() => {
            });
    }

    async function walkTo(x, y) {
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
                    Command: "move_to",
                    Arg1: "" + parseInt(x) + "",
                    Arg2: "" + parseInt(y) + "",
                    Arg3: ''
                })
            })
            .then((res) => res.json())
            .then((res) => {
            }).catch(() => {
            });
    }

    function onPressMap(c) {
        const _c = c.nativeEvent;
        const lat = LatToY(_c.coordinate.latitude);
        const lng = LngToX(_c.coordinate.longitude);
        walkTo(lng, lat);
    }

    useEffect(() => {
        if (detail != null) {

            // Pets
            const pets = jsonConvert(normalizeJson(detail.pets));
            const pickPet = Object.keys(pets).find(key => pets[key].type == "pick");
            const fellowPet = Object.keys(pets).find(key => pets[key].type == "fellow");
            const attackPet = Object.keys(pets).find(key => pets[key].type == "wolf");
            const transportPet = Object.keys(pets).find(key => pets[key].type == "transport");
            const horsePet = Object.keys(pets).find(key => pets[key].type == "horse");
            setPets({
                pickPet: pickPet,
                fellowPet: fellowPet,
                attackPet: attackPet,
                transportPet: transportPet,
                horsePet: horsePet
            })

            // Active skills
            try {
                const _skills = jsonConvert(normalizeJson(detail.skills));
                const skillsArray = [];
                for (const [key, value] of Object.entries(_skills)) {
                    const _name = value.name;
                    const _servername = value.servername;
                    skillsArray.push({ servername: _servername, name: _name });
                }
                setSkills(skillsArray);
            }
            catch { }

            if (activeTab == 2) {
                // nearby monsters
                const monsters = jsonConvert(normalizeJson(detail.monsters));
                const monstersArray = [];
                for (const [key, value] of Object.entries(monsters)) {
                    const _x = xToLng(value.x);
                    const _y = yToLat(value.y);
                    const _name = value.name;
                    monstersArray.push({ x: _x, y: _y, name: _name });
                }
                setMonstersInArea(monstersArray);

                // nearby players
                //const players = jsonConvert(normalizeJson(detail.players));
                /*
                const playersArray = [];
                for (const [key, value] of Object.entries(players)) {
                    const _x = xToLng(value.x);
                    const _y = yToLat(value.y);
                    const _name = value.name;
                    playersArray.push({ x: _x, y: _y, name: _name });
                }
                setPlayersInArea(playersArray);
                */
            }

            // Drops in near
            try {
                const _drops = jsonConvert(normalizeJson(detail.drops));
                const dropsArray = [];
                for (const [key, value] of Object.entries(_drops)) {
                    const _name = value.name;
                    const _servername = value.servername;
                    const _plus = value.plus;
                    const _canpick = value.can_pick;
                    dropsArray.push({ servername: _servername, name: _name, plus: _plus, can_pick: _canpick });
                }
                setDrops(dropsArray);
            }
            catch { }
        }
    }, [detail]);

    useEffect(() => {
        setMapFree(false);
    }, [activeTab])


    if (detail == null) {
        return (
            <>
                <LoaderPage />
            </>
        )
    }

    // Training area
    const radius = detail.character.trainingArea.radius;
    const x = xToLng(detail.character.trainingArea.x);
    const y = yToLat(detail.character.trainingArea.y);

    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('GenelBilgi')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(2)} activeOpacity={0.8}>
                            <Text style={activeTab == 2 ? styles.title : styles.titlePassive}>{i18n.t('Harita')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(3)} activeOpacity={0.8}>
                            <Text style={activeTab == 3 ? styles.title : styles.titlePassive}>{i18n.t('CevremdekiItemler')}</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#999', fontSize: 12, }}>CID{charId}</Text>
                    </View>
                </ScrollView>
            </View>
            {
                activeTab == 1 ?
                    <View>
                        <Text>

                        </Text>
                        <TwoColumnPerc title={'HP'} perc={calculateHPMPPerc(detail.character.hp, detail.character.hp_max)} color={'#D34A4A'} />
                        <TwoColumnPerc title={'MP'} perc={calculateHPMPPerc(detail.character.mp, detail.character.mp_max)} color={'#2D76BF'} />
                        <TwoColumnPerc title={'EXP'} perc={calculateEXP(detail.character.current_exp, detail.character.max_exp)} color={'#3ABA13'} />
                        <TwoColumn title={'SP'} desc={detail.character.sp} />
                        {
                            skills.length > 0 ?
                                <View style={styles.skills}>
                                    {
                                        skills.map((skill, i) => {
                                            return (
                                                <TouchableOpacity onPress={() => setSkillName(skill.name)} key={i} style={styles.skill}>
                                                    <Image style={{ width: 32, height: 32, position: 'absolute', left: 0, top: 0 }} source={{ uri: 'https://api.sromc.com/charinfo/skillimage?S=' + skill.servername }} />
                                                </TouchableOpacity>

                                            )
                                        })
                                    }
                                </View>
                                : null
                        }
                        {
                            skillName != '' ?
                                <>
                                    <TouchableOpacity onPress={() => setSkillName('')}>
                                        <Text style={{ color: '#fff', marginTop: 10 }}>{skillName} [X]</Text>
                                    </TouchableOpacity>
                                </>
                                : null
                        }
                        <Divider />
                        <TwoColumn title={'Level'} desc={'Lvl ' + detail.character.level.toLocaleString()} />
                        <TwoColumn title={'Gold'} desc={detail.character.gold.toLocaleString()} />
                        <TwoColumn title={i18n.t('Konum')} desc={detail.character.regionName} />
                        <TwoColumn title={i18n.t('OlumSayisi')} desc={detail.character.dies} />
                        <TwoColumn title={i18n.t('DusenSOXSayisi')} desc={detail.character.rareItems} />
                        <TwoColumn title={i18n.t('DusenItemSayisi')} desc={detail.character.items} />
                        <TwoColumn title={i18n.t('Koordinatlar')} desc={'X:' + detail.character.x.toFixed(2) + ', Y:' + detail.character.y.toFixed(2)} />
                        <TwoColumn title={i18n.t('ToplayiciPet')} desc={pets != undefined && pets.pickPet != undefined ? i18n.t('Aktif') : i18n.t('Pasif')} />
                        <TwoColumn title={i18n.t('SaldiriPeti')} desc={pets != undefined && pets.attackPet != undefined ? i18n.t('Aktif') : i18n.t('Pasif')} />
                        <TwoColumn title={'Fellow Pet'} desc={pets != undefined && pets.fellowPet != undefined ? i18n.t('Aktif') : i18n.t('Pasif')} />
                        <TwoColumn title={'Transport Pet'} desc={pets != undefined && pets.transportPet != undefined ? i18n.t('Aktif') : i18n.t('Pasif')} />
                        <TwoColumn title={'Job'} desc={detail.character.job_name != '' ? '*' + detail.character.job_name : '-'} />
                        <TwoColumnPerc title={'Job EXP'} perc={calculateEXP(detail.character.job_current_exp, detail.character.job_max_exp)} color={'#3ABA13'} />
                        <TwoColumn title={'Job Level'} desc={'-'} />
                        <TwoColumn title={'Guild'} desc={detail.character.guild} />
                        <TwoColumn title={i18n.t('KarakterDurumu')} desc={detail.character.dead == true ? i18n.t('Olu') : i18n.t('Hayatta')} />
                        <Divider />
                        <TwoColumn title={raceType(detail.character.model) == 'EU' ? i18n.t('Avrupali') : i18n.t('Cinli') + ' (' + raceType(detail.character.model) + ')'} desc={gameLocal(detail.character.locale)} />
                        <TwoColumn title={'Char ID'} desc={detail.charId} />
                        <Divider />
                        <TouchableOpacity onPress={() => removeChar()}>
                            <Text style={styles.removeText}>{i18n.t('BuKarakteriSil')}</Text>
                        </TouchableOpacity>
                    </View>
                    : null
            }

            {
                activeTab == 2 ?
                    <View style={{ flex: 1, minHeight: 450, borderRadius: 10, overflow: 'hidden', borderColor: '#A57056', borderWidth: 1 }}>
                        <Text style={{ color: '#A57056', textAlign: 'center', paddingTop: 5 }}>{detail.character.regionName}</Text>
                        <Text style={{ color: '#A57056', textAlign: 'center', paddingBottom: 5 }}>{'X:' + detail.character.x.toFixed(2) + ', Y:' + detail.character.y.toFixed(2)}</Text>
                        <MapView
                            region={!mapFree ? {
                                latitude: yToLat(detail.character.y),
                                longitude: xToLng(detail.character.x),
                                latitudeDelta: 3,
                                longitudeDelta: 3
                            } : null}
                            onPanDrag={() => setMapFree(true)}
                            onLongPress={onPressMap}
                            userInterfaceStyle={'dark'}
                            mapType={'standard'}
                            zoomControlEnabled={false}
                            zoomEnabled={false}
                            zoomTapEnabled={false}
                            /*scrollEnabled={false}*/
                            cacheEnabled={false}
                            minDelta={3}
                            showsCompass={false}
                            style={{ flex: 1 }}>
                            <UrlTile
                                shouldReplaceMapContent={true}
                                minimumZ={8}
                                maximumZ={8}
                                maximumNativeZ={8}
                                flipY={true}
                                urlTemplate="https://sromc.com/minimapjpg/world/{x}x{y}.jpg"
                            />
                            {
                                monstersInArea.map((monster, i) => {
                                    return <Monster key={i} x={monster.x} y={monster.y} name={monster.name} />
                                })
                            }
                            <Marker coordinate={{ latitude: yToLat(detail.character.y), longitude: xToLng(detail.character.x) }}>
                                <View style={styles.player} />
                            </Marker>
                            <Circle zIndex={2} fillColor={'rgba(255,255,255,0.2)'} strokeWidth={1} strokeColor={'#fff'} radius={radius * 500} center={{ latitude: y, longitude: x }} />
                        </MapView>
                    </View>
                    : null
            }

            {
                activeTab == 3 ?
                    <View>
                        {
                            drops.map((item, i) => {
                                return (
                                    <Item
                                        key={i}
                                        name={item.name}
                                        count={item.can_pick ? '1 ' + i18n.t('Toplanabilir') : '1 ' + i18n.t('Toplanamaz')}
                                        durability={0}
                                        servername={item.servername}
                                        plus={item.plus} />
                                )
                            })
                        }
                        {
                            drops.length == 0 ?
                                <>
                                    <View style={{ display: 'flex', alignContent: 'center', alignItems: 'center', marginTop: 25 }}>
                                        <Image style={{ width: 80, height: 80, marginBottom: 4 }} source={require('../../images/running.png')} />
                                        <Text style={{ width: '50%', fontSize: 15, marginTop: 15, color: '#fff', textAlign: 'center', opacity: 0.5 }}>
                                            {i18n.t('ToplanabilirItemYok')}
                                        </Text>
                                    </View>
                                </>
                                : null
                        }
                    </View>
                    : null
            }

        </>
    )
}

function Monster({ x, y, name }) {
    return (
        <Marker zIndex={10} coordinate={{ latitude: y, longitude: x }}>
            <View style={styles.monster} />
        </Marker>
    )
}

const styles = StyleSheet.create({
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
    removeText: {
        marginTop: 5,
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    player: {
        position: 'absolute',
        width: 13,
        height: 13,
        backgroundColor: 'green',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 10
    },
    monster: {
        position: 'absolute',
        width: 11,
        height: 11,
        backgroundColor: 'red',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 4
    },
    skills: {
        display: 'flex',
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    skill: {
        width: 32,
        height: 32,
        marginRight: 3
    }
});