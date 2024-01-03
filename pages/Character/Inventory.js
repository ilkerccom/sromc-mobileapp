import i18n from 'i18n-js';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { DEFAULT_ICON_COLOR } from 'react-native-vector-icons/dist/lib/create-icon-set';
import Item from '../../components/blocks/Item';
import LoaderPage from '../../components/blocks/LoaderPage';
import NoContent from '../../components/blocks/NoContent';
import TwoColumn from '../../components/blocks/TwoColumn';
import TwoColumnPerc from '../../components/blocks/TwoColumnPerc';
import Divider from '../../components/Divider';
import { jsonConvert, normalizeJson } from '../../src/helpers';
import ItemThemed from '../../components/blocks/ItemThemed';

export default function Inventory({ detail, scrollToTop }) {

    const [activeTab, setActiveTab] = useState(1);
    const [activePage, setActivePage] = useState(1);
    const [showEquipped, setShowEquipped] = useState(false);
    const [petItems, setPetItems] = useState([]);

    useEffect(() => {
        if (detail != undefined) {
            const pets = jsonConvert(normalizeJson(detail.pets));
            const pickerPet = Object.keys(pets).find(key => pets[key].type == "pick");
            if (pickerPet != undefined) {
                for (const [key, value] of Object.entries(pets)) {
                    if (value.type == 'pick') {
                        setPetItems(value.items);
                        break;
                    }
                }
            }
        }
    }, [detail]);

    useEffect(() => {
        if (activePage != 1) {
            setActivePage(1);
        }
    }, [activeTab])

    useEffect(() => {
        if (showEquipped && activePage != 1) {
            setActivePage(1);
            setShowEquipped(true);
        }
    }, [showEquipped])

    useEffect(() => {
        scrollToTop();
        if (showEquipped && activePage != 1) {
            setShowEquipped(false);
        }
    }, [activePage])



    if (detail == null) {
        return (
            <>
                <LoaderPage />
            </>
        )
    }

    //
    let inventory = jsonConvert(normalizeJson(detail.inventory, true)).items;
    const storage = jsonConvert(normalizeJson(detail.storage, true)).items;
    const storage_guild = jsonConvert(normalizeJson(detail.storage_guild, true)).items;

    //
    if (showEquipped) {
        inventory = inventory.slice(0, 13);
    }
    else {
        inventory = inventory.slice(13, inventory.length);
    }

    return (
        <>
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}>
                    <View style={styles.titleRoot}>
                        <TouchableOpacity onPress={() => setActiveTab(1)} activeOpacity={0.8}>
                            <Text style={activeTab == 1 ? styles.title : styles.titlePassive}>{i18n.t('Envanter')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(2)} activeOpacity={0.8}>
                            <Text style={activeTab == 2 ? styles.title : styles.titlePassive}>{i18n.t('Depo')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(4)} activeOpacity={0.8}>
                            <Text style={activeTab == 4 ? styles.title : styles.titlePassive}>{i18n.t('GuildDeposu')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab(3)} activeOpacity={0.8}>
                            <Text style={activeTab == 3 ? styles.title : styles.titlePassive}>{i18n.t('ToplayiciPet')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {
                activeTab == 1 ?
                    <View>
                        <TouchableOpacity onPress={() => setShowEquipped(!showEquipped)} style={styles.showEquipped}>
                            <Text style={styles.showEquippedText}>
                                {showEquipped ? i18n.t('KusanilmislariGizle') : i18n.t('KusanilmislariGoster')}
                            </Text>
                        </TouchableOpacity>
                        <View>
                            {
                                inventory.slice((activePage - 1) * (32), activePage * 32).map((item, i) => {
                                    return (
                                        <Item
                                            key={i}
                                            name={item.name}
                                            count={item.quantity}
                                            durability={item.durability}
                                            servername={item.servername}
                                            plus={item.plus} />
                                    )
                                })
                            }
                        </View>

                        <View style={styles.pagination}>
                            {
                                Array.from(Array(Math.ceil((inventory.length) / 32)).keys()).map((page, i) => {
                                    return (
                                        <TouchableOpacity key={i} style={activePage == (i + 1) ? styles.activePage : styles.page} onPress={() => setActivePage(i + 1)}>
                                            <Text style={activePage == (i + 1) ? { fontWeight: 'bold', color: '#fff' } : { fontWeight: 'bold' }}>{i + 1}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                    : null
            }

            {
                activeTab == 2 ?
                    <View>
                        {
                            storage.slice((activePage - 1) * 30, activePage * 30).map((item, i) => {
                                return (
                                    <Item
                                        key={i}
                                        name={item.name}
                                        count={item.quantity}
                                        durability={item.durability}
                                        servername={item.servername}
                                        plus={item.plus} />
                                )
                            })
                        }
                        {
                            storage.length > 30 ?

                                <View style={styles.pagination}>
                                    {
                                        Array.from(Array(Math.ceil(storage.length / 30)).keys()).map((page, i) => {
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
                activeTab == 4 ?
                    <View>
                        {
                            storage_guild.slice((activePage - 1) * 30, activePage * 30).map((item, i) => {
                                return (
                                    <Item
                                        key={i}
                                        name={item.name}
                                        count={item.quantity}
                                        durability={item.durability}
                                        servername={item.servername}
                                        plus={item.plus} />
                                )
                            })
                        }
                        {
                            storage_guild.length > 30 ?

                                <View style={styles.pagination}>
                                    {
                                        Array.from(Array(Math.ceil(storage.length / 30)).keys()).map((page, i) => {
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
                activeTab == 3 ?
                    <View>
                        {
                            petItems.map((item, i) => {
                                return (
                                    <Item
                                        key={i}
                                        name={item.name}
                                        count={item.quantity}
                                        durability={item.durability}
                                        servername={item.servername}
                                        plus={item.plus} />
                                )
                            })
                        }
                    </View>
                    : null
            }
            {
                activeTab == 3 && petItems.length == 0 ?
                    <NoContent title={i18n.t('Erisilemedi')} desc={i18n.t('ToplayiciPetYok')} />
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
    others: {
        color: '#fff',
        marginTop: 30,
        marginBottom: 10,
        textAlign: 'center'
    },
    noPet: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 30
    },
    showEquipped: {
        backgroundColor: '#653A25',
        borderRadius: 50,
        padding: 5,
        marginBottom: 4
    },
    showEquippedText: {
        color: '#999',
        textAlign: 'center'
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